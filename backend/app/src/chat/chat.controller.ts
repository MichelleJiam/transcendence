import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { CreatePenaltyDto } from "src/penalty/dto/create-penalty.dto";
import { Penalty } from "src/penalty/penalty.entity";
import { Message } from "src/message/message.entity";
import { Chatroom } from "./chat.entity";
import { ChatService } from "./chat.service";
import { AddAdminDto } from "./dto/add-admin.dto";
import { AddMemberDto } from "./dto/add-member.dto";
import { CreateChatroomDto } from "./dto/create-chat.dto";
import { SwapOwnerDto } from "./dto/swap-owner.dto";
import { UpdateChatroomDto } from "./dto/update-chat.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { currentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "src/user/user.entity";
import { isCurrentUser } from "src/user/user.utils";

@Controller("chat")
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatroomService: ChatService) {}

  // GENERAL CHAT FUNCTIONS
  // GET
  @Get(":id")
  async getChatroomInfoById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<Chatroom | undefined> {
    try {
      return this.chatroomService.getChatroomInfoById(id);
    } catch (err) {
      console.error(err);
    }
  }

  @Get("user/:userId")
  async getChatroomsOfUser(
    @Param("userId", ParseIntPipe) userId: number,
    @currentUser() user: User,
  ): Promise<Chatroom[]> {
    isCurrentUser(user.id, userId);
    return this.chatroomService.getChatroomsOfUser(userId);
  }

  @Get("type/:type")
  async getChatroomByType(@Param("type") type: string): Promise<Chatroom[]> {
    return this.chatroomService.getChatroomByType(type);
  }

  @Get("DM/:userOne/:userTwo")
  async findDMChatroom(
    @Param("userOne", ParseIntPipe) userOne: number,
    @Param("userTwo", ParseIntPipe) userTwo: number,
  ): Promise<Chatroom | null> {
    return this.chatroomService.findDMChatroom(userOne, userTwo);
  }

  @Get(":chatroomId/messages")
  async getMessagesFromChatroom(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
  ): Promise<Message[]> {
    return this.chatroomService.getMessagesFromChatroom(chatroomId);
  }

  @Get(":chatroomId/user/:userId/messages")
  async getMessagesFromChatroomForUser(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Param("userId", ParseIntPipe) userId: number,
    @currentUser() user: User,
  ): Promise<Message[] | undefined> {
    try {
      isCurrentUser(user.id, userId);
      return this.chatroomService.getMessagesFromChatroomForUser(
        chatroomId,
        userId,
      );
    } catch (err) {
      console.error(err);
    }
  }

  @Get(":chatroomId/penalties")
  async getPenaltiesFromChatroom(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
  ): Promise<Penalty[]> {
    return this.chatroomService.getPenaltiesByChatroom(chatroomId);
  }

  @Get(":chatroomId/is_admin/:adminId")
  async isAdmin(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Param("adminId", ParseIntPipe) adminId: number,
  ): Promise<boolean> {
    return this.chatroomService.isAdminOfChatroom(chatroomId, adminId);
  }

  @Get(":chatroomId/is_member/:memberId")
  async isMember(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Param("memberId", ParseIntPipe) memberId: number,
  ): Promise<boolean> {
    return this.chatroomService.isMemberOfChatroom(chatroomId, memberId);
  }

  @Get(":chatroomId/is_owner/:ownerId")
  async isOwner(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Param("ownerId", ParseIntPipe) ownerId: number,
  ): Promise<boolean> {
    return this.chatroomService.isOwnerOfChatroom(chatroomId, ownerId);
  }

  // POST
  @Post("create")
  async createChatroom(
    @Body() createChatroomDto: CreateChatroomDto,
    @currentUser() user: User,
  ): Promise<Chatroom | undefined> {
    try {
      isCurrentUser(user.id, createChatroomDto.user);
      return this.chatroomService.createChatroom(createChatroomDto);
    } catch (err) {
      console.error(err);
    }
  }

  @Post(":chatroomId/admin/:adminId/penalty")
  async createPenalty(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Param("adminId", ParseIntPipe) adminId: number,
    @Body() createPenaltyDto: CreatePenaltyDto,
    @currentUser() user: User,
  ): Promise<Penalty | undefined> {
    try {
      isCurrentUser(user.id, adminId);
      return await this.chatroomService.createPenalty(
        chatroomId,
        adminId,
        createPenaltyDto,
      );
    } catch (err) {
      console.error(err);
    }
  }

  // PUT
  @Put(":chatroomId/add/member")
  async addMemberToChatroomById(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Body() addMemberDto: AddMemberDto,
  ): Promise<Chatroom | undefined> {
    try {
      // check if user is not banned from chat
      return await this.chatroomService.addMemberToChatroom(
        chatroomId,
        addMemberDto,
      );
    } catch (err) {
      console.error(err);
    }
  }

  // ADMIN FUNCTIONALITIES //

  @Put(":chatroomId/add/admin")
  async addAdminToChatroomById(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Body() addAdminDto: AddAdminDto,
    @currentUser() user: User,
  ): Promise<Chatroom | undefined> {
    try {
      isCurrentUser(user.id, addAdminDto.byAdmin);
      return this.chatroomService.addAdminToChatroom(chatroomId, addAdminDto);
    } catch (err) {
      console.error(err);
    }
  }

  // is adminId the same as the id of the user who called this?
  @Put(":chatroomId/change_owner")
  async changeOwnerofChatroomById(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Body() swapOwnerDto: SwapOwnerDto,
    @currentUser() user: User,
  ): Promise<Chatroom | undefined> {
    try {
      isCurrentUser(user.id, swapOwnerDto.oldOwner);
      return this.chatroomService.changeOwnerofChatroomById(
        chatroomId,
        swapOwnerDto,
      );
    } catch (err) {
      console.error(err);
    }
  }

  // UPDATERS //
  @Put(":chatroomId/admin/:adminId/update/info")
  async updateChatroomInfoById(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Param("adminId", ParseIntPipe) adminId: number,
    @Body() updateChatroomDto: UpdateChatroomDto,
    @currentUser() user: User,
  ): Promise<Chatroom | undefined> {
    try {
      isCurrentUser(user.id, adminId);
      return this.chatroomService.updateChatroomInfoById(
        chatroomId,
        adminId,
        updateChatroomDto,
      );
    } catch (err) {
      console.error(err);
    }
  }

  // DELETE FUNCTIONS
  @Delete(":chatroomId/admin/:adminId/delete/user/:userId")
  async deleteUserFromChatroom(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Param("adminId", ParseIntPipe) adminId: number,
    @Param("userId", ParseIntPipe) userId: number,
    @currentUser() user: User,
  ): Promise<Chatroom | undefined> {
    try {
      isCurrentUser(user.id, adminId);
      return this.chatroomService.kickUser(chatroomId, adminId, userId);
    } catch (err) {
      console.error(err);
    }
  }

  @Delete(":chatroomId/admin/:adminId/delete/admin/:toDeleteId")
  async deleteAdminFromChatroom(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Param("adminId", ParseIntPipe) adminId: number,
    @Param("toDeleteId", ParseIntPipe) toDeleteId: number,
    @currentUser() user: User,
  ): Promise<Chatroom | undefined> {
    try {
      isCurrentUser(user.id, adminId);
      return this.chatroomService.deleteAdminFromChatroom(
        chatroomId,
        adminId,
        toDeleteId,
      );
    } catch (err) {
      console.error(err);
    }
  }

  @Delete(":chatroomId/user/:userId/leave")
  async leaveChatroom(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Param("userId", ParseIntPipe) userId: number,
    @currentUser() user: User,
  ): Promise<Chatroom | string | undefined> {
    try {
      isCurrentUser(user.id, userId);
      return this.chatroomService.leaveChatroom(chatroomId, userId);
    } catch (err) {
      console.error(err);
    }
  }
}
