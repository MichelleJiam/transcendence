import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chatroom } from "src/chat/chat.entity";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { CreateMessageDto } from "./dto/create-message.dto";
import { Message } from "./message.entity";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async getAllMessages() {
    return this.messageRepository.find({
      relations: {
        userId: true,
        chatroomId: true,
      },
      order: {
        userId: {
          id: "asc",
        },
      },
    });
  }

  async create(
    createMessageDto: CreateMessageDto,
    chatroom: Chatroom,
    user: User,
  ) {
    const newMessage = new Message();
    newMessage.body = createMessageDto.body;
    newMessage.chatroomId = chatroom;
    newMessage.userId = user;
    newMessage.playerName = user.playerName;
    return this.messageRepository.save(newMessage);
  }

  async getMessageByUserId(id: number) {
    const messages = await this.messageRepository.find({
      relations: {
        userId: true,
        chatroomId: true,
      },
      where: {
        userId: {
          id: id,
        },
      },
      select: {
        userId: {
          id: true,
          playerName: true,
        },
        chatroomId: {
          id: true,
          chatroomName: true,
          type: true,
        },
        body: true,
        createdAt: true,
      },
    });
    if (messages) return messages;
    throw new HttpException("Posts not found", HttpStatus.NOT_FOUND);
  }
}
