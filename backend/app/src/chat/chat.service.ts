import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MessageService } from "src/message/message.service";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import {
  addAdmin,
  addMember,
  createChatroomEntity,
  createUpdatedChatroomEntity,
  deleteAdmin,
  deleteFromChatroom,
  swapOwner,
  validateChatroomDto,
} from "./chat-validators.methods";
import { Chatroom } from "./chat.entity";
import { ChatMethod } from "./chat.methods";
import { AddAdminDto } from "./dto/add-admin.dto";
import { AddMemberDto } from "./dto/add-member.dto";
import { CreateMessageDto } from "src/message/dto/create-message.dto";
import { CreateChatroomDto } from "./dto/create-chat.dto";
import { SwapOwnerDto } from "./dto/swap-owner.dto";
import { UpdateChatroomDto } from "./dto/update-chat.dto";
import { Message } from "src/message/message.entity";
import { PenaltyService } from "src/penalty/penalty.service";
import { CreatePenaltyDto } from "src/penalty/dto/create-penalty.dto";
import { Penalty } from "src/penalty/penalty.entity";
import { BlocklistService } from "src/blocklist/blocklist.service";
import { filterMessages } from "src/blocklist/blocklist.method";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chatroom)
    private readonly chatroomRepository: Repository<Chatroom>,

    private readonly messageService: MessageService,
    private readonly chatMethod: ChatMethod,
    private readonly penaltyService: PenaltyService,
    private readonly blocklistService: BlocklistService,
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

  async getChatroomInfoById(id: number): Promise<Chatroom> {
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

  async getMessagesFromChatroom(chatroomId: number): Promise<Message[]> {
    return this.messageService.getMessagesFromChatroom(chatroomId);
  }

  async getMessagesFromChatroomForUser(
    chatroomId: number,
    userId: number,
  ): Promise<Message[]> {
    const messages = await this.messageService.getMessagesFromChatroom(
      chatroomId,
    );
    const blocklist = await this.blocklistService.getBlockedUsersForUser(
      userId,
    );
    const newMessages = filterMessages(messages, blocklist);
    return newMessages;
  }

  async getPenaltiesByChatroom(chatroomId: number) {
    return this.penaltyService.getPenaltiesByChatroom(chatroomId);
  }

  async getChatroomsOfUser(userId: number): Promise<Chatroom[]> {
    const chatrooms = await this.chatroomRepository.find({
      relations: {
        message: true,
        owner: true,
        admin: true,
        member: true,
        penalty: true,
      },
      where: {
        member: {
          id: userId,
        },
      },
    });
    return chatrooms;
  }

  async getChatroomByType(type: string): Promise<Chatroom[]> {
    const chatrooms = await this.chatroomRepository.find({
      relations: {
        message: true,
        owner: true,
        admin: true,
        member: true,
        penalty: true,
      },
      where: {
        type: type,
      },
    });
    return chatrooms;
  }

  // POST
  async createChatroom(
    createChatroomDto: CreateChatroomDto,
  ): Promise<Chatroom> {
    if (validateChatroomDto(createChatroomDto) === true) {
      const user = await this.chatMethod.getUser(createChatroomDto.user);
      let userTwo: User | undefined;
      if (createChatroomDto.otherUser !== undefined) {
        userTwo = await this.chatMethod.getUser(createChatroomDto.otherUser);
      } else {
        userTwo = undefined;
      }
      const chatroom = createChatroomEntity(createChatroomDto, user, userTwo);
      const newChatroom = this.chatroomRepository.create(chatroom);
      return this.chatroomRepository.save(newChatroom);
    }
    throw new HttpException(
      "Unable to create chatroom",
      HttpStatus.BAD_REQUEST,
    );
  }

  async postMessageToChatroom(
    chatroomId: number,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    if (
      (await this.chatMethod.isMemberOfChatroom(
        createMessageDto.userId,
        chatroomId,
      )) == true &&
      (await this.penaltyService.isMutedFromChatroom(
        chatroomId,
        createMessageDto.userId,
      )) == false
    ) {
      const chatroom = await this.getChatroomInfoById(chatroomId);
      const user = await this.chatMethod.getUser(createMessageDto.userId);
      return this.messageService.create(createMessageDto, chatroom, user);
    }
    throw new HttpException(
      "You do not have permission to send messages here.",
      HttpStatus.FORBIDDEN,
    );
  }

  async createPenalty(
    chatroomId: number,
    adminId: number,
    createPenaltyDto: CreatePenaltyDto,
  ): Promise<Penalty> {
    if (
      (await this.chatMethod.canReceivePenalty(
        chatroomId,
        adminId,
        createPenaltyDto,
      )) == true
    ) {
      const chatroom = await this.getChatroomInfoById(
        createPenaltyDto.chatroom,
      );
      const userPenalty = await this.chatMethod.getUser(createPenaltyDto.user);
      if (createPenaltyDto.penaltyType === "ban") {
        this.deleteUserFromChatroom(chatroomId, createPenaltyDto.user);
      }
      return this.penaltyService.createPenalty(
        chatroom,
        userPenalty,
        createPenaltyDto,
      );
    }
    throw new HttpException("Unable to make penalty.", HttpStatus.BAD_REQUEST);
  }

  // UPDATE - ADDING - PUT
  async addMemberToChatroom(
    chatroomId: number,
    addMemberDto: AddMemberDto,
  ): Promise<Chatroom> {
    const chatroom = await this.getChatroomInfoById(chatroomId);
    if (chatroom.type === "password") {
      if (chatroom.password !== addMemberDto.password)
        throw new HttpException("Incorrect password", HttpStatus.BAD_REQUEST);
    }
    if (
      (await this.chatMethod.isMemberOfChatroom(
        addMemberDto.member,
        chatroomId,
      )) == true
    )
      return this.getChatroomInfoById(chatroomId);
    const user = await this.chatMethod.getUser(addMemberDto.member);
    if (
      (await this.penaltyService.isBannedFromChatroom(
        chatroomId,
        addMemberDto.member,
      )) == false
    ) {
      const newChatroom = addMember(chatroom, user);
      return this.chatroomRepository.save(newChatroom);
    }
    throw new HttpException("You are Banned", HttpStatus.BAD_REQUEST);
  }

  async addAdminToChatroom(
    chatroomId: number,
    addAdminDto: AddAdminDto,
  ): Promise<Chatroom> {
    const chatroom = await this.getChatroomInfoById(chatroomId);
    if (
      (await this.chatMethod.isAdminOfChatroom(
        addAdminDto.byAdmin,
        chatroomId,
      )) == true
    ) {
      if (
        (await this.chatMethod.isAdminOfChatroom(
          addAdminDto.newAdmin,
          chatroomId,
        )) == true
      )
        return this.getChatroomInfoById(chatroomId);
      const newAdmin = await this.chatMethod.getUser(addAdminDto.newAdmin);
      const updatedChatroom = addAdmin(chatroom, newAdmin);
      return this.chatroomRepository.save(updatedChatroom);
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
    const chatroom = await this.getChatroomInfoById(chatroomId);
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
      const newChatroom = swapOwner(chatroom, newOwner);
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
    const chatroom = await this.getChatroomInfoById(chatroomId);
    if (await this.chatMethod.isOwnerOfChatroom(adminId, chatroomId)) {
      const updateChatroom = createUpdatedChatroomEntity(
        chatroom,
        updateChatroomDto,
      );
      this.chatroomRepository.save(updateChatroom);
      return updateChatroom;
    }
    throw new HttpException(
      "You do not have permission to change chat details",
      HttpStatus.FORBIDDEN,
    );
  }

  // UPDATE - REMOVING/DELETING
  async deleteAdminFromChatroom(
    chatroomId: number,
    adminId: number,
    toDeleteId: number,
  ): Promise<Chatroom> {
    const chatroom = await this.getChatroomInfoById(chatroomId);
    if (
      (await this.chatMethod.isAdminOfChatroom(adminId, chatroomId)) &&
      (await this.chatMethod.hasMultipleAdminsInChatroom(chatroomId)) &&
      (await this.chatMethod.isOwnerOfChatroom(toDeleteId, chatroomId)) == false
    ) {
      const updatedChatroom = deleteAdmin(chatroom, toDeleteId);
      return this.chatroomRepository.save(updatedChatroom);
    } else {
      throw new HttpException(
        "You don't have permission to remove admins",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteUserFromChatroom(
    chatroomId: number,
    userId: number,
  ): Promise<Chatroom> {
    const chatroom = await this.getChatroomInfoById(chatroomId);
    if (await this.chatMethod.isOwnerOfChatroom(userId, chatroomId)) {
      throw new HttpException(
        "Cannot remove owner of chatroom",
        HttpStatus.BAD_REQUEST,
      );
    }
    const updatedChatroom = deleteFromChatroom(chatroom, userId);
    return await this.chatroomRepository.save(updatedChatroom);
  }

  async leaveChatroom(
    chatroomId: number,
    toDeleteId: number,
  ): Promise<Chatroom | string> {
    const chatroom = await this.getChatroomInfoById(chatroomId);
    if (await this.chatMethod.onlyOnePersonInChatroom(chatroomId)) {
      this.deleteChatroom(chatroomId);
      return "Chatroom has been deleted.";
    }
    if (
      (await this.chatMethod.isOwnerOfChatroom(toDeleteId, chatroomId)) == true
    ) {
      if (
        (await this.chatMethod.hasMultipleAdminsInChatroom(chatroomId)) == true
      ) {
        swapOwner(chatroom, chatroom.admin[1]);
      } else {
        swapOwner(chatroom, chatroom.member[1]);
      }
    }
    const updatedChatroom = deleteFromChatroom(chatroom, toDeleteId);
    return await this.chatroomRepository.save(updatedChatroom);
  }

  // DELETE CHAT
  async deleteChatroom(chatroomId: number): Promise<void> {
    await this.chatroomRepository
      .createQueryBuilder("chatroom")
      .delete()
      .from(Chatroom)
      .where("id = :id", { id: chatroomId })
      .execute();
  }
}
