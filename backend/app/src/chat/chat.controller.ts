import {
  Controller,
  Post,
  Get,
  NotFoundException,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from "@nestjs/common";
import { CreateMessageDto } from "src/message/dto/create-message.dto";
import { CreatePenaltyDto } from "src/penalty/dto/create-penalty.dto";
import { Penalty } from "src/penalty/penalty.entity";
import { ChatService } from "./chat.service";
import { AddAdminDto } from "./dto/add-admin.dto";
import { AddMemberDto } from "./dto/add-member.dto";
import { CreateChatroomDto } from "./dto/create-chat.dto";
import { SwapOwnerDto } from "./dto/swap-owner.dto";
import { UpdateChatroomDto } from "./dto/update-chat.dto";

// TODO:
//  VALIDATE USER BEFORE DOING ANYTHING is active user same as user in dto

@Controller("chat")
export class ChatController {
  constructor(private readonly chatroomService: ChatService) {}

  // GENERAL CHAT FUNCTIONS
  // GET
  @Get()
  getAllChatRooms() {
    try {
      return this.chatroomService.getAllChatrooms();
    } catch (err) {
      throw NotFoundException;
    }
  }

  @Get(":id")
  async getChatroomInfoById(@Param("id", ParseIntPipe) id: number) {
    try {
      return this.chatroomService.getChatroomInfoById(id);
    } catch (err) {
      console.log(err);
    }
  }

  @Get("user/:userId")
  async getChatroomsOfUser(@Param("userId", ParseIntPipe) userId: number) {
    return this.chatroomService.getChatroomsOfUser(userId);
  }

  @Get(":type")
  async getChatroomByType(@Param("type") type: string) {
    return this.chatroomService.getChatroomByType(type);
  }

  @Get(":chatroomId/messages")
  async getMessagesFromChatroom(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
  ) {
    return this.chatroomService.getMessagesFromChatroom(chatroomId);
  }

  @Get(":chatroomId/penalties")
  async getPenaltiesFromChatroom(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
  ) {
    return this.chatroomService.getPenaltiesByChatroom(chatroomId);
  }

  // POST
  // is member the same Id as the logged in user?
  @Post("create")
  async createChatroom(@Body() createChatroomDto: CreateChatroomDto) {
    try {
      return this.chatroomService.createChatroom(createChatroomDto);
    } catch (err) {
      console.log(err);
    }
  }

  // is member the same Id as the logged in user?
  @Post(":chatroomId/post_message")
  async postMessageToChatroom(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.chatroomService.postMessageToChatroom(
      chatroomId,
      createMessageDto,
    );
  }

  @Post(":chatroomId/admin/:adminId/ban")
  async createPenalty(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Param("adminId", ParseIntPipe) adminId: number,
    @Body() createPenaltyDto: CreatePenaltyDto,
  ): Promise<Penalty> {
    return this.chatroomService.createPenalty(
      chatroomId,
      adminId,
      createPenaltyDto,
    );
  }

  // PUT
  // is member the same Id as the logged in user?
  @Put(":chatroomId/add/member")
  async addMemberToChatroomById(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Body() addMemberDto: AddMemberDto,
  ) {
    try {
      // check if user is not banned from chat
      return this.chatroomService.addMemberToChatroom(chatroomId, addMemberDto);
    } catch (err) {
      console.log(err);
    }
  }

  // ADMIN FUNCTIONALITIES //

  // is adminId the same as the id of the user who called this?
  @Put(":chatroomId/add/admin")
  async addAdminToChatroomById(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Body() addAdminDto: AddAdminDto,
  ) {
    try {
      // check if user is not banned from chat
      return this.chatroomService.addAdminToChatroom(chatroomId, addAdminDto);
    } catch (err) {
      console.log(err);
    }
  }

  // is adminId the same as the id of the user who called this?
  @Put(":chatroomId/change_owner")
  async changeOwnerofChatroomById(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Body() swapOwnerDto: SwapOwnerDto,
  ) {
    try {
      // check if user is not banned from chat
      return this.chatroomService.changeOwnerofChatroomById(
        chatroomId,
        swapOwnerDto,
      );
    } catch (err) {
      console.log(err);
    }
  }

  // UPDATERS //
  // function to update password or change chatroom name
  // is adminId the same as the id of the user who called this?
  @Put(":chatroomId/admin/:adminId/update/info")
  async updateChatroomInfoById(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Param("adminId", ParseIntPipe) adminId: number,
    @Body() updateChatroomDto: UpdateChatroomDto,
  ) {
    try {
      return this.chatroomService.updateChatroomInfoById(
        chatroomId,
        adminId,
        updateChatroomDto,
      );
    } catch (err) {
      console.log(err);
    }
  }

  // DELETE FUNCTIONS
  @Delete(":chatroomId/delete/:userId")
  async deleteUserFromChatroom(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Param("userId", ParseIntPipe) userId: number,
  ) {
    try {
      return this.chatroomService.deleteUserFromChatroom(chatroomId, userId);
    } catch (err) {
      console.log(err);
    }
  }

  // is adminId the same as the id of the user who called this?
  @Delete(":chatroomId/admin/:adminId/delete/:toDeleteId")
  async deleteAdminFromChatroom(
    @Param("chatroomId", ParseIntPipe) chatroomId: number,
    @Param("adminId", ParseIntPipe) adminId: number,
    @Param("toDeleteId", ParseIntPipe) toDeleteId: number,
  ) {
    try {
      return this.chatroomService.deleteAdminFromChatroom(
        chatroomId,
        adminId,
        toDeleteId,
      );
    } catch (err) {
      console.log(err);
    }
  }
}
