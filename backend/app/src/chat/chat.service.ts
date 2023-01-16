import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MessageService } from "src/message/message.service";
import { Role } from "src/role/role.entity";
import { RoleService } from "src/role/role.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { validateChatroomDto } from "./chat-validators.methods";
import { Chatroom } from "./chat.entity";
import { AddAdminDto } from "./dto/add-admin.dto";
import { AddMemberDto } from "./dto/add-member.dto";
import { CreateChatroomDto } from "./dto/create-chat.dto";
import { RemoveAdminDto } from "./dto/remove-admin.dto";
import { SwapOwnerDto } from "./dto/swap-owner.dto";

@Injectable()
export class ChatService {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,

    @InjectRepository(Chatroom)
    private readonly chatroomRepository: Repository<Chatroom>,
  ) {}

  async initiateOwner(user: number, chatroom: Chatroom): Promise<Chatroom> {
    for (let i = 0; i < 3; i++) {
      const newRole = await this.roleService.createRole(
        user,
        this.roleService.roleTypes[i],
      );
      if (newRole) {
        if (i == 0) {
          chatroom.role = [newRole];
        } else {
          chatroom.role.push(newRole);
        }
      } else {
        throw new HttpException("User does not exist.", HttpStatus.BAD_REQUEST);
      }
    }
    return chatroom;
  }

  async getUser(userId: number) {
    console.log(userId);
    const user = await this.userService.findUserById(userId);
    if (user) return user;
    else {
      throw new HttpException("User does not exist.", HttpStatus.BAD_REQUEST);
    }
  }

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
      if (user) chatroom.user = [user];
      else {
        throw new HttpException("User does not exist.", HttpStatus.BAD_REQUEST);
      }
      const chatroomRoles = await this.initiateOwner(
        createChatroomDto.user,
        chatroom,
      );
      const newChatroom = this.chatroomRepository.create(chatroomRoles);
      return this.chatroomRepository.save(newChatroom);
    }
    throw new HttpException(
      "Unable to create chatroom",
      HttpStatus.BAD_REQUEST,
    );
  }

  async getAllChatrooms(): Promise<Chatroom[]> {
    const foundChats = await this.chatroomRepository.find({
      relations: {
        message: true,
        role: true,
        penalty: true,
        user: true,
      },
      select: {
        id: true,
        chatroomName: true,
        type: true,
        password: true,
        role: {
          id: true,
          roleName: true,
          user: {
            id: true,
            playerName: true,
          },
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
        role: true,
        penalty: true,
        user: true,
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

  async addMemberToChatroom(
    chatroomId: number,
    addMemberDto: AddMemberDto,
  ): Promise<Chatroom> {
    const chatroom = await this.getChatroomById(chatroomId);
    console.log("member id: %d", addMemberDto.member);
    const user = await this.getUser(addMemberDto.member);
    console.log(user);
    // add ban check
    const role = await this.roleService.createRole(
      addMemberDto.member,
      "member",
    );
    chatroom.user.push(user);
    chatroom.role.push(role);
    console.log(chatroom);
    const newChatroom = this.chatroomRepository.create(chatroom);
    return this.chatroomRepository.save(newChatroom);
  }

  async addAdminToChatroom(
    chatroomId: number,
    addAdminDto: AddAdminDto,
  ): Promise<Chatroom> {
    const chatroom = await this.getChatroomById(chatroomId);
    if (
      await this.roleService.isAdminOfChatroom(addAdminDto.byAdmin, chatroomId)
    ) {
      const newRole = await this.roleService.createRole(
        addAdminDto.newAdmin,
        "admin",
      );
      chatroom.role.push(newRole);
      const newChatroom = this.chatroomRepository.create(chatroom);
      this.chatroomRepository.save(newChatroom);
    }
    return chatroom;
  }

  async swapOwnerOfChatroom(
    chatroomId: number,
    swapOwnerDto: SwapOwnerDto,
  ): Promise<void> {
    const chatroom = await this.getChatroomById(chatroomId);
    if (
      (await this.roleService.isAdminOfChatroom(
        swapOwnerDto.newOwner,
        chatroomId,
      )) &&
      (await this.roleService.isOwnerOfChatroom(
        swapOwnerDto.oldOwner,
        chatroomId,
      ))
    ) {
      await this.roleService.removeRoleFromUserInChatroom(
        swapOwnerDto.oldOwner,
        chatroom,
        "owner",
      );
      const newRole = await this.roleService.createRole(
        swapOwnerDto.newOwner,
        "owner",
      );
      chatroom.role.push(newRole);
      const newChatroom = this.chatroomRepository.create(chatroom);
      this.chatroomRepository.save(newChatroom);
    } else {
      throw new HttpException(
        "You don't have permission to reassign ownership, or the owner specified is not the owner",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteAdminFromChatroom(
    chatroomId: number,
    removeUserDto: RemoveAdminDto,
  ): Promise<void> {
    const chatroom = await this.getChatroomById(chatroomId);
    if (
      await this.roleService.isAdminOfChatroom(
        removeUserDto.byAdmin,
        chatroomId,
      )
    ) {
      await this.roleService.removeRoleFromUserInChatroom(
        removeUserDto.deleteAdmin,
        chatroom,
        "admin",
      );
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
    if (await this.roleService.isOwnerOfChatroom(userId, chatroomId)) {
      throw new HttpException(
        "Cannot remove owner of chatroom",
        HttpStatus.BAD_REQUEST,
      );
    }
    chatroom.user.filter((user: User) => {
      return user.id !== userId;
    });
    chatroom.role.filter((role: Role) => {
      return role.user.find((user: User) => {
        user.id !== userId;
      });
    });
    await this.chatroomRepository.save(chatroom);
  }
}
