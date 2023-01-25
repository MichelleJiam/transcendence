import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chatroom } from "src/chat/chat.entity";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { CreateMessageDto } from "./dto/create-message.dto";
import { Message } from "./message.entity";
import { createNewMessage } from "./message.method";

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

  async getMessagesFromChatroom(chatroomId: number): Promise<Message[]> {
    const messages = await this.messageRepository.find({
      relations: {
        chatroomId: true,
        userId: true,
      },
      where: {
        chatroomId: {
          id: chatroomId,
        },
      },
    });
    return messages;
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

  async create(
    createMessageDto: CreateMessageDto,
    chatroom: Chatroom,
    user: User,
  ) {
    const newMessage = createNewMessage(createMessageDto.body, chatroom, user);
    return this.messageRepository.save(newMessage);
  }
}
