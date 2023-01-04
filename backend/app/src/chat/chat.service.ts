import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chatroom } from "./chat.entity";
import { AddAdminDto } from "./dto/add-admin.dto";
import { AddMemberDto } from "./dto/add-member.dto";
import { CreateChatroomDto } from "./dto/create-chat.dto";
import { UpdateChatroomDto } from "./dto/update-chat.dto";

function validateChatroomType(type: string): void {
  if (type != "public" && type != "password" && type != "private") {
    console.log("From Backend: Invalid chatroom type");
    throw new HttpException("Invalid chatroom type", HttpStatus.BAD_REQUEST);
  }
}

function validateChatroomName(chatroomName: string): void {
  if (!chatroomName || !(chatroomName && chatroomName.trim())) {
    console.log("From Backend: Chatroom name cannot be empty");
    throw new HttpException(
      "Chatroom name cannot be empty",
      HttpStatus.BAD_REQUEST,
    );
  }
}

function validateChatroomPasswordSet(password: string) {
  if (!(password && password.trim())) {
    console.log("From Backend: Password type chatroom cannot have no password");
    throw new HttpException(
      "Password type chatroom cannot have no password",
      HttpStatus.BAD_REQUEST,
    );
  }
}

function validateChatroomDto(createChatroomDto: CreateChatroomDto): boolean {
  validateChatroomType(createChatroomDto.type);
  validateChatroomName(createChatroomDto.chatroomName);
  if (createChatroomDto.type == "password") {
    validateChatroomPasswordSet(createChatroomDto.password);
  }
  return true;
}

function hasMultipleAdmins(chatroomUserAdminAmount: number) {
  if (chatroomUserAdminAmount < 2) {
    console.log(
      "You are the only admin! Please assign admin to another user or delete the chat.",
    );
    throw new HttpException(
      "You are the only admin! Please assign admin to another user or delete the chat.",
      HttpStatus.METHOD_NOT_ALLOWED,
    );
  }
}

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chatroom)
    private readonly chatroomRepository: Repository<Chatroom>,
  ) {}

  // helper functions
  // checks if userId is an admin of a certain chat
  async isAdmin(chatroomId: number, userId: number): Promise<boolean> {
    const findAdmin = await this.chatroomRepository.find({
      relations: {
        admin: true,
      },
      where: {
        id: chatroomId,
        admin: {
          id: userId,
        },
      },
    });
    if (findAdmin) {
      return true;
    } else {
      return false;
    }
  }
  // checks if userId is a member of a certain chat
  async isMember(chatroomId: number, userId: number): Promise<boolean> {
    const findMember = await this.chatroomRepository.find({
      relations: {
        member: true,
      },
      where: {
        id: chatroomId,
        member: {
          id: userId,
        },
      },
    });
    if (findMember) {
      return true;
    } else {
      return false;
    }
  }

  // GET functions
  async getAllChatrooms(): Promise<Chatroom[]> {
    const foundChats = await this.chatroomRepository.find({
      relations: {
        admin: true,
        member: true,
        messages: true,
      },
      select: {
        id: true,
        chatroomName: true,
        type: true,
        password: true,
        admin: {
          id: true,
          username: true,
          email: true,
        },
        member: {
          id: true,
          username: true,
          email: true,
        },
        messages: true,
      },
    });
    return foundChats;
  }

  async getChatroomById(id: number): Promise<Chatroom> {
    const chatroom = await this.chatroomRepository.findOneBy({
      id: id,
    });
    if (!chatroom) {
      throw new HttpException("Chatroom not found", HttpStatus.NOT_FOUND);
    }
    return chatroom;
  }

  // PUT function
  async updateChatroomById(
    id: number,
    updateChatroomDto: UpdateChatroomDto,
  ): Promise<Chatroom> {
    const chatroom = this.getChatroomById(id);

    this.chatroomRepository.update(id, updateChatroomDto);
    return await this.getChatroomById(id);
  }

  async addMemberToChatroomById(
    id: number,
    addMemberDto: AddMemberDto,
  ): Promise<Chatroom> {
    const chatroom = await this.getChatroomById(id);
    // check how to update a many to many relation
    // like an append???
    this.chatroomRepository.update(id, addMemberDto);
    return await this.getChatroomById(id);
  }

  async addAdminToChatroomById(
    id: number,
    addAdminDto: AddAdminDto,
  ): Promise<Chatroom> {
    const chatroom = await this.getChatroomById(id);

    this.chatroomRepository.update(id, addAdminDto);
    return await this.getChatroomById(id);
  }

  // POST functions
  async createChatroom(
    createChatroomDto: CreateChatroomDto,
  ): Promise<Chatroom> {
    if (validateChatroomDto(createChatroomDto) === true) {
      const newChatroom = this.chatroomRepository.create(createChatroomDto);
      return this.chatroomRepository.save(newChatroom);
    }
    throw new HttpException(
      "Unable to create chatroom",
      HttpStatus.BAD_REQUEST,
    );
  }

  // DELETE functions
  async deleteMember(chatroomId: number, userId: number): Promise<void> {
    const chatroomUserMember = await this.chatroomRepository.delete({
      id: chatroomId,
      member: {
        id: userId,
      },
    });
    if (!chatroomUserMember.affected) {
      console.log("User not found in chat");
      throw new HttpException("User not found in chat", HttpStatus.NOT_FOUND);
    }
  }

  async deleteAdmin(chatroomId: number, userId: number): Promise<void> {
    const chatroomUserAdminAmount = await this.chatroomRepository
      .createQueryBuilder("chatroom")
      .select("chatroom.admin", "totalAdmin")
      .getCount();

    hasMultipleAdmins(chatroomUserAdminAmount);
    const chatroomUserAdmin = await this.chatroomRepository.delete({
      id: chatroomId,
      admin: {
        id: userId,
      },
    });
  }

  async removeMemberFromChatroom(
    chatroomId: number,
    userId: number,
    requesterId: number,
  ): Promise<boolean> {
    if (await this.isAdmin(chatroomId, requesterId)) {
      if (await this.isMember(chatroomId, userId)) {
        this.deleteMember(chatroomId, userId);
      }
      if (await this.isAdmin(chatroomId, userId)) {
        this.deleteAdmin(chatroomId, userId);
      }
      return true;
    }
    return false;
  }

  async removeAdminFromChatroom(
    chatroomId: number,
    userId: number,
    requesterId: number,
  ): Promise<boolean> {
    if (await this.isAdmin(chatroomId, requesterId)) {
      if (await this.isAdmin(chatroomId, userId)) {
        this.deleteAdmin(chatroomId, userId);
      }
      return true;
    }
    throw new HttpException(
      "You do not have the privileges to remove an admin",
      HttpStatus.METHOD_NOT_ALLOWED,
    );
  }

  async deleteChatroom(id: number): Promise<void> {
    const deleteResponse = await this.chatroomRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException("Chatroom not found", HttpStatus.NOT_FOUND);
    }
  }
}
