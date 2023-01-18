import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MessageService } from "src/message/message.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import {
  validateChatroomDto,
  validateChatroomPasswordSet,
} from "./chat-validators.methods";
import { Chatroom } from "./chat.entity";
import { ChatMethod } from "./chat.methods";
import { AddAdminDto } from "./dto/add-admin.dto";
import { AddMemberDto } from "./dto/add-member.dto";
import { CreateChatroomDto } from "./dto/create-chat.dto";
import { RemoveAdminDto } from "./dto/remove-admin.dto";
import { SwapOwnerDto } from "./dto/swap-owner.dto";
import { UpdateChatroomDto } from "./dto/update-chat.dto";

@Injectable()
export class ChatService {
  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly chatMethod: ChatMethod,

    @InjectRepository(Chatroom)
    private readonly chatroomRepository: Repository<Chatroom>,
  ) {}

  // GETTERS
  async getAllChatrooms(): Promise<Chatroom[]> {
    const foundChats = await this.chatroomRepository.find({
      order: {
        id: "asc",
      },
      relations: {
        message: true,
        owner: true,
        admin: true,
        member: true,
        penalty: true,
      },
      select: {
        id: true,
        chatroomName: true,
        type: true,
        password: true,
        owner: {
          id: true,
          playerName: true,
        },
        admin: {
          id: true,
          playerName: true,
        },
        member: {
          id: true,
          playerName: true,
        },
        penalty: {
          penaltyType: true,
          user: {
            id: true,
            playerName: true,
          },
        },
        message: true,
      },
    });
    return foundChats;
  }

  async getChatroomById(id: number): Promise<Chatroom> {
    const chatroom = await this.chatroomRepository.findOne({
      relations: {
        message: true,
        owner: true,
        admin: true,
        member: true,
        penalty: true,
      },
      where: {
        id: id,
      },
    });
    if (!chatroom) {
      throw new HttpException("Chatroom not found", HttpStatus.NOT_FOUND);
    }
    return chatroom;
  }

  // POST
  async createChatroom(
    createChatroomDto: CreateChatroomDto,
  ): Promise<Chatroom> {
    if (validateChatroomDto(createChatroomDto) === true) {
      const chatroom = new Chatroom();
      chatroom.chatroomName = createChatroomDto.chatroomName;
      chatroom.type = createChatroomDto.type;
      if (chatroom.type === "password")
        chatroom.password = createChatroomDto.password;

      const user = await this.userService.findUserById(createChatroomDto.user);
      if (user) {
        chatroom.owner = user;
        chatroom.member = [user];
        chatroom.admin = [user];
      } else {
        throw new HttpException("User does not exist.", HttpStatus.BAD_REQUEST);
      }
      const newChatroom = this.chatroomRepository.create(chatroom);
      return this.chatroomRepository.save(newChatroom);
    }
    throw new HttpException(
      "Unable to create chatroom",
      HttpStatus.BAD_REQUEST,
    );
  }

  // UPDATE - ADDING
  async addMemberToChatroom(
    chatroomId: number,
    addMemberDto: AddMemberDto,
  ): Promise<Chatroom> {
    const chatroom = await this.getChatroomById(chatroomId);
    const user = await this.chatMethod.getUser(addMemberDto.member);
    // add ban check
    chatroom.member.push(user);
    const newChatroom = this.chatroomRepository.create(chatroom);
    return this.chatroomRepository.save(newChatroom);
  }

  async addAdminToChatroom(
    chatroomId: number,
    addAdminDto: AddAdminDto,
  ): Promise<Chatroom> {
    const chatroom = await this.getChatroomById(chatroomId);
    if (
      (await this.chatMethod.isAdminOfChatroom(
        addAdminDto.byAdmin,
        chatroomId,
      )) == true
    ) {
      const newAdmin = await this.chatMethod.getUser(addAdminDto.newAdmin);
      chatroom.admin.push(newAdmin);
      this.chatroomRepository.save(chatroom);
      return chatroom;
    }
    throw new HttpException(
      "You don't have permission to assign new admins.",
      HttpStatus.BAD_REQUEST,
    );
  }

  async changeOwnerofChatroomById(
    chatroomId: number,
    swapOwnerDto: SwapOwnerDto,
  ): Promise<Chatroom> {
    const chatroom = await this.getChatroomById(chatroomId);
    if (
      (await this.chatMethod.isAdminOfChatroom(
        swapOwnerDto.newOwner,
        chatroomId,
      )) &&
      (await this.chatMethod.isOwnerOfChatroom(
        swapOwnerDto.oldOwner,
        chatroomId,
      ))
    ) {
      const newOwner = await this.chatMethod.getUser(swapOwnerDto.newOwner);
      chatroom.owner = newOwner;
      const newChatroom = this.chatroomRepository.create(chatroom);
      this.chatroomRepository.save(newChatroom);
      return newChatroom;
    } else {
      throw new HttpException(
        "You don't have permission to reassign ownership, or the owner specified is not the owner",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateChatroomInfoById(
    chatroomId: number,
    adminId: number,
    updateChatroomDto: UpdateChatroomDto,
  ): Promise<Chatroom> {
    const chatroom = await this.getChatroomById(chatroomId);
    if (await this.chatMethod.isAdminOfChatroom(adminId, chatroomId)) {
      if (updateChatroomDto.type !== undefined) {
        chatroom.type = updateChatroomDto.type;
        if (updateChatroomDto.type === "password") {
          if (updateChatroomDto.password === undefined) {
            throw new HttpException(
              "password type chat must have a password",
              HttpStatus.BAD_REQUEST,
            );
          } else {
            validateChatroomPasswordSet(updateChatroomDto.password);
            chatroom.password = updateChatroomDto.password;
          }
        }
      }
      if (updateChatroomDto.chatroomName !== undefined) {
        chatroom.chatroomName = updateChatroomDto.chatroomName;
      }
      this.chatroomRepository.save(chatroom);
      return chatroom;
    }
    throw new HttpException(
      "You do not have permission to change chat details",
      HttpStatus.BAD_REQUEST,
    );
  }

  // UPDATE - REMOVING
  async deleteAdminFromChatroom(
    chatroomId: number,
    removeUserDto: RemoveAdminDto,
  ): Promise<void> {
    const chatroom = await this.getChatroomById(chatroomId);
    if (
      (await this.chatMethod.isAdminOfChatroom(
        removeUserDto.byAdmin,
        chatroomId,
      )) &&
      (await this.chatMethod.hasMultipleAdminsInChatroom(chatroomId)) &&
      (await this.chatMethod.isOwnerOfChatroom(
        removeUserDto.deleteAdmin,
        chatroomId,
      )) == false
    ) {
      chatroom.admin = chatroom.admin.filter((user: User) => {
        return user.id !== removeUserDto.deleteAdmin;
      });
    } else {
      throw new HttpException(
        "You don't have permission to remove admins",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeUserFromChatroom(
    chatroomId: number,
    userId: number,
  ): Promise<void> {
    const chatroom = await this.getChatroomById(chatroomId);
    if (await this.chatMethod.isOwnerOfChatroom(userId, chatroomId)) {
      throw new HttpException(
        "Cannot remove owner of chatroom",
        HttpStatus.BAD_REQUEST,
      );
    }
    chatroom.member = chatroom.member.filter((user: User) => {
      return user.id !== userId;
    });
    chatroom.admin = chatroom.admin.filter((user: User) => {
      return user.id !== userId;
    });
    await this.chatroomRepository.save(chatroom);
  }
}
