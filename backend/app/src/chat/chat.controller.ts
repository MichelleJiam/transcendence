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
import { RoleService } from "src/role/role.service";
import { ChatService } from "./chat.service";
import { AddAdminDto } from "./dto/add-admin.dto";
import { AddMemberDto } from "./dto/add-member.dto";
import { CreateChatroomDto } from "./dto/create-chat.dto";
import { UpdateChatroomDto } from "./dto/update-chat.dto";

// TODO:
// 	- create function that updates password
//	- add users to chat
//	- delete users to chat
// 	- give assign admin to chat

@Controller("chat")
export class ChatController {
  constructor(private readonly chatroomService: ChatService) {}

  // DISPLAY AVAILABLE CHATROOMS
  @Get()
  getAllChatRooms() {
    try {
      return this.chatroomService.getAllChatrooms();
    } catch (err) {
      throw NotFoundException;
    }
  }

  // GENERAL CHAT FUNCTIONS
  @Post("create")
  async createChatroom(@Body() createChatroomDto: CreateChatroomDto) {
    try {
      return this.chatroomService.createChatroom(createChatroomDto);
    } catch (err) {
      console.log(err);
    }
  }

  @Get("room/:id")
  async getChatroomById(@Param("id", ParseIntPipe) id: number) {
    try {
      return this.chatroomService.getChatroomById(id);
    } catch (err) {
      console.log(err);
    }
  }
  // function to add members
  @Post("room/:chatroomId/add/member")
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

  // UPDATERS //
  // function to update password or change chatroom name
  @Put("room/:id/admin/:adminId/update/info")
  async updateChatroomById(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateChatroomDto: UpdateChatroomDto,
  ) {
    try {
      return this.chatroomService.updateChatroom(id, updateChatroomDto);
    } catch (err) {
      console.log(err);
    }
  }

  // DELETE FUNCTIONS
  @Delete("room/:id/delete/:userId")
  async leaveChatroom(
    @Param("id", ParseIntPipe) id: number,
    @Param("userId", ParseIntPipe) userId: number,
  ) {
    try {
      return this.chatroomService.leaveChatroom(id, userId);
    } catch (err) {
      console.log(err);
    }
  }
}
