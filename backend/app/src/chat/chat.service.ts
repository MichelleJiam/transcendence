import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
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
  validateChatroomPasswordSet,
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
import { ChatGateway } from "./chat.gateway";
import { AuthService } from "src/auth/auth.service";
import { InviteToGameDto } from "./dto/invite-to-game.dto";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chatroom)
    private readonly chatroomRepository: Repository<Chatroom>,

    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway,

    private readonly messageService: MessageService,
    private readonly chatMethod: ChatMethod,
    private readonly penaltyService: PenaltyService,
    private readonly blocklistService: BlocklistService,
    private readonly authService: AuthService,
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
      },
      select: {
        id: true,
        chatroomName: true,
        type: true,
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
      },
      where: {
        id: id,
      },
      select: {
        id: true,
        chatroomName: true,
        type: true,
        gameRequestByUserId: true,
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
      },
    });
    if (!chatroom) {
      throw new HttpException("Chatroom not found", HttpStatus.NOT_FOUND);
    }
    return chatroom;
  }

  async getChatroomPassword(id: number): Promise<string> {
    const chatroom = await this.chatroomRepository.findOne({
      where: {
        id: id,
      },
      select: {
        password: true,
      },
    });
    if (!chatroom) {
      throw new HttpException("Chatroom not found", HttpStatus.NOT_FOUND);
    }
    return chatroom.password;
  }

  async getMessagesFromChatroom(chatroomId: number): Promise<Message[]> {
    return this.messageService.getMessagesFromChatroom(chatroomId);
  }

  async createGameInvite(inviteToGameDto: InviteToGameDto): Promise<void> {
    const chatroom = await this.getChatroomInfoById(inviteToGameDto.chatroomId);
    if (chatroom) {
      chatroom.gameRequestByUserId = inviteToGameDto.playerOne;
      await this.chatroomRepository.save(chatroom);
    }
  }

  async deleteGameInvite(inviteToGameDto: InviteToGameDto): Promise<void> {
    const chatroom = await this.getChatroomInfoById(inviteToGameDto.chatroomId);
    if (chatroom) {
      chatroom.gameRequestByUserId = 0;
      await this.chatroomRepository.save(chatroom);
    }
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
      order: {
        id: "desc",
      },
      relations: {
        owner: true,
        member: true,
      },
      where: {
        member: {
          id: userId,
        },
      },
      select: {
        id: true,
        chatroomName: true,
        type: true,
        owner: {
          id: true,
          playerName: true,
        },
      },
      cache: true,
    });
    return chatrooms;
  }

  async getChatroomByType(type: string): Promise<Chatroom[]> {
    const chatrooms = await this.chatroomRepository.find({
      order: {
        id: "asc",
      },
      relations: {
        owner: true,
      },
      where: {
        type: type,
      },
      select: {
        id: true,
        chatroomName: true,
        type: true,
        owner: {
          id: true,
          playerName: true,
        },
      },
      cache: true,
    });
    return chatrooms;
  }

  async findDMChatroom(
    userOne: number,
    userTwo: number,
  ): Promise<Chatroom | null> {
    const chatroomsUserOne = await this.chatroomRepository.find({
      relations: {
        member: true,
      },
      where: {
        type: "DM",
        member: {
          id: userOne,
        },
      },
      select: {
        member: {
          id: true,
        },
      },
    });
    const chatroomsUserTwo = await this.chatroomRepository.find({
      relations: {
        member: true,
      },
      where: {
        type: "DM",
        member: {
          id: userTwo,
        },
      },
      select: {
        member: {
          id: true,
        },
      },
    });
    if (chatroomsUserOne && chatroomsUserTwo) {
      for (const chatroomUserOne of chatroomsUserOne) {
        for (const chatroomUsertwo of chatroomsUserTwo) {
          if (chatroomUsertwo.id == chatroomUserOne.id) {
            return chatroomUserOne;
          }
        }
      }
    }
    return null;
  }

  async isAdminOfChatroom(
    chatroomId: number,
    adminId: number,
  ): Promise<boolean> {
    return this.chatMethod.isAdminOfChatroom(adminId, chatroomId);
  }

  async isMemberOfChatroom(
    chatroomId: number,
    memberId: number,
  ): Promise<boolean> {
    return this.chatMethod.isMemberOfChatroom(memberId, chatroomId);
  }

  async isOwnerOfChatroom(
    chatroomId: number,
    ownerId: number,
  ): Promise<boolean> {
    return this.chatMethod.isOwnerOfChatroom(ownerId, chatroomId);
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
      if (createChatroomDto.type == "password") {
        const hashedPassword = await this.authService.hashPassword(
          createChatroomDto.password,
        );
        createChatroomDto.password = hashedPassword;
      }
      const chatroom = createChatroomEntity(createChatroomDto, user, userTwo);
      const newChatroom = this.chatroomRepository.create(chatroom);
      return await this.chatroomRepository.save(newChatroom);
    }
    throw new HttpException(
      "Unable to create chatroom",
      HttpStatus.BAD_REQUEST,
    );
  }

  async postMessageToChatroom(
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    this.penaltyService.clearOldPenalties();
    if (
      (await this.chatMethod.isMemberOfChatroom(
        createMessageDto.userId,
        createMessageDto.chatroomId,
      )) == true &&
      (await this.penaltyService.isMutedFromChatroom(
        createMessageDto.chatroomId,
        createMessageDto.userId,
      )) == false
    ) {
      const chatroom = await this.getChatroomInfoById(
        createMessageDto.chatroomId,
      );
      const user = await this.chatMethod.getUser(createMessageDto.userId);
      return await this.messageService.create(createMessageDto, chatroom, user);
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
      if (
        createPenaltyDto.penaltyType === "ban" &&
        (await this.penaltyService.isBannedFromChatroom(
          chatroomId,
          createPenaltyDto.user,
        )) == true
      ) {
        throw new HttpException("Already banned.", HttpStatus.BAD_REQUEST);
      } else if (
        createPenaltyDto.penaltyType === "mute" &&
        (await this.penaltyService.isMutedFromChatroom(
          chatroomId,
          createPenaltyDto.user,
        )) == true
      ) {
        throw new HttpException("Already muted.", HttpStatus.BAD_REQUEST);
      }
      if (createPenaltyDto.penaltyType === "ban") {
        this.deleteUserFromChatroom(chatroomId, createPenaltyDto.user);
      }
      const chatroom = await this.getChatroomInfoById(
        createPenaltyDto.chatroom,
      );
      const userPenalty = await this.chatMethod.getUser(createPenaltyDto.user);
      return await this.penaltyService.createPenalty(
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
      const password = await this.getChatroomPassword(chatroomId);
      if (
        (addMemberDto.password != undefined &&
          (await this.authService.checkPassword(
            addMemberDto.password,
            password,
          )) == false) ||
        addMemberDto.password == undefined ||
        !(addMemberDto.password && addMemberDto.password.trim())
      ) {
        throw new HttpException("Incorrect password", HttpStatus.BAD_REQUEST);
      }
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
    throw new HttpException("You are Banned", HttpStatus.FORBIDDEN);
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
      ) {
        return this.getChatroomInfoById(chatroomId);
      }
      if (
        (await this.penaltyService.isBannedFromChatroom(
          chatroomId,
          addAdminDto.newAdmin,
        )) == false
      ) {
        const newAdmin = await this.chatMethod.getUser(addAdminDto.newAdmin);
        const updatedChatroom = addAdmin(chatroom, newAdmin);
        return this.chatroomRepository.save(updatedChatroom);
      } else {
        throw new HttpException("You are Banned", HttpStatus.FORBIDDEN);
      }
    }
    throw new HttpException(
      "You don't have permission to assign new admins.",
      HttpStatus.FORBIDDEN,
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
      )) &&
      (await this.penaltyService.isBannedFromChatroom(
        chatroomId,
        swapOwnerDto.newOwner,
      )) == false
    ) {
      const newOwner = await this.chatMethod.getUser(swapOwnerDto.newOwner);
      chatroom.owner = newOwner;
      const newChatroom = swapOwner(chatroom, newOwner);
      this.chatroomRepository.save(newChatroom);
      return newChatroom;
    } else {
      throw new HttpException(
        "You don't have permission to reassign ownership, or the owner specified is not the owner",
        HttpStatus.FORBIDDEN,
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
      if (updateChatroomDto.type === "password" || updateChatroomDto.password) {
        if (updateChatroomDto.type !== "password") {
          updateChatroomDto.type = "password";
        }
        if (updateChatroomDto.password) {
          validateChatroomPasswordSet(updateChatroomDto.password);
          updateChatroomDto.password = await this.authService.hashPassword(
            updateChatroomDto.password,
          );
        } else {
          throw new HttpException(
            "Password type chatroom cannot have no password",
            HttpStatus.BAD_REQUEST,
          );
        }
      }
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
    if ((await this.chatMethod.onlyOnePersonInChatroom(chatroomId)) == true) {
      this.deleteChatroom(chatroomId);
      console.log("deleted chatroom");
      return "Chatroom has been deleted.";
    }
    if (
      (await this.chatMethod.isOwnerOfChatroom(toDeleteId, chatroomId)) == true
    ) {
      if (
        (await this.chatMethod.hasMultipleAdminsInChatroom(chatroomId)) == true
      ) {
        swapOwner(chatroom, chatroom.admin[1]);
      } else if (
        (await this.chatMethod.hasMultipleMembersInChatroom(chatroomId)) == true
      ) {
        for (const member of chatroom.member) {
          if (member.id != chatroom.owner.id) {
            swapOwner(chatroom, member);
            addAdmin(chatroom, member);
            break;
          }
        }
      } else {
        this.deleteChatroom(chatroomId);
      }
    }
    const updatedChatroom = deleteFromChatroom(chatroom, toDeleteId);
    return await this.chatroomRepository.save(updatedChatroom);
  }

  async kickUser(chatroomId: number, adminId: number, userId: number) {
    const chatroom = await this.getChatroomInfoById(chatroomId);
    if ((await this.isAdminOfChatroom(chatroomId, adminId)) == true) {
      const newChatroom = deleteFromChatroom(chatroom, userId);
      return await this.chatroomRepository.save(newChatroom);
    }
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
