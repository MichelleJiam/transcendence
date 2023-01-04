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

  @Get()
  getAllChatRooms() {
    try {
      return this.chatroomService.getAllChatrooms();
    } catch (err) {
      throw NotFoundException;
    }
  }

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

  // function to update password or change chatroom name
  @Put("room/:id/update/info")
  async updateChatroomById(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateChatroomDto: UpdateChatroomDto,
  ) {
    try {
      return this.chatroomService.updateChatroomById(id, updateChatroomDto);
    } catch (err) {
      console.log(err);
    }
  }

  // function to add members
  @Put("room/:id/update/members")
  async addMemberToChatroomById(
    @Param("id", ParseIntPipe) id: number,
    @Body() addMemberDto: AddMemberDto,
  ) {
    try {
      return this.chatroomService.addMemberToChatroomById(id, addMemberDto);
    } catch (err) {
      console.log(err);
    }
  }

  // function to remove members
  @Delete("room/:id/admin/:adminId/delete/member/:userId")
  async removeMemberFromChatroom(
    @Param("id", ParseIntPipe) id: number,
    @Param("userId") userId: number,
    @Param("adminId") adminId: number,
  ) {
    try {
      return this.chatroomService.removeMemberFromChatroom(id, userId, adminId);
    } catch (err) {
      console.log(err);
    }
  }

  // function to add admin
  @Put("room/:id/update/admins")
  async addAdminToChatroomById(
    @Param("id", ParseIntPipe) id: number,
    @Body() addAdminDto: AddAdminDto,
  ) {
    try {
      return this.chatroomService.addAdminToChatroomById(id, addAdminDto);
    } catch (err) {
      console.log(err);
    }
  }

  // function to remove admin
  @Delete("room/:id/admin/:adminId/delete/admin/:userId")
  async removeAdminFromChatroom(
    @Param("id", ParseIntPipe) id: number,
    @Param("userId") userId: number,
    @Param("adminId") adminId: number,
  ) {
    try {
      return this.chatroomService.removeMemberFromChatroom(id, userId, adminId);
    } catch (err) {
      console.log(err);
    }
  }
}
