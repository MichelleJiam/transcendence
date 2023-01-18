import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MessageService } from "src/message/message.service";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { Chatroom } from "./chat.entity";

@Injectable()
export class ChatMethod {
  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService,

    @InjectRepository(Chatroom)
    private readonly chatroomRepository: Repository<Chatroom>,
  ) {}

  async getUser(userId: number) {
    const user = await this.userService.findUserById(userId);
    if (user) return user;
    else {
      throw new HttpException("User does not exist.", HttpStatus.BAD_REQUEST);
    }
  }

  async isAdminOfChatroom(
    userId: number,
    chatroomId: number,
  ): Promise<boolean> {
    const admin = await this.chatroomRepository.findOne({
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
    if (admin) return true;
    return false;
  }

  async hasMultipleAdminsInChatroom(chatroomId: number) {
    const admin = await this.chatroomRepository.findOne({
      relations: {
        admin: true,
      },
      where: {
        id: chatroomId,
      },
    });
    if (admin) {
      if (admin.admin.length > 1) return true;
    }
    return false;
  }

  async isMemberOfChatroom(
    userId: number,
    chatroomId: number,
  ): Promise<boolean> {
    const member = await this.chatroomRepository.findOne({
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
    if (member) return true;
    return false;
  }

  async isOwnerOfChatroom(
    userId: number,
    chatroomId: number,
  ): Promise<boolean> {
    const owner = await this.chatroomRepository.findOne({
      relations: {
        owner: true,
      },
      where: {
        id: chatroomId,
        owner: {
          id: userId,
        },
      },
    });
    if (owner) return true;
    return false;
  }
}
