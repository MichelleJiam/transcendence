import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateMessageDto } from "./dto/CreateMessage.dto";
import { Message } from "./Message.entity";

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
      },
      order: {
        userId: {
          id: "asc",
        },
      },
    });
  }

  async create(createMessageDto: CreateMessageDto) {
    const newMessage = this.messageRepository.create(createMessageDto);
    const existingUser = await this.messageRepository.findOneBy({
      userId: {
        id: createMessageDto.userId.id,
      },
    });
    if (existingUser) return this.messageRepository.save(newMessage);
  }

  async getMessageByUserId(id: number) {
    const messages = await this.messageRepository.find({
      relations: {
        userId: true,
      },
      where: {
        userId: {
          id: id,
        },
      },
      select: {
        userId: {
          id: true,
          username: true,
          email: true,
        },
        body: true,
        created_at: true,
      },
    });
    if (messages) return messages;
    throw new HttpException("Posts not found", HttpStatus.NOT_FOUND);
  }

  // finds username and retrieves all messages from this user
  // relations links the userId column in the message entity with
  // the id in the user entity
  // where defines where username is the same as the given username
  // select shows which columns should be returned
  // https://typeorm.io/find-options#find-options
  async getMessageByUsername(username: string) {
    const messages = await this.messageRepository.find({
      relations: {
        userId: true,
      },
      where: {
        userId: {
          username: username,
        },
      },
      select: {
        userId: {
          id: true,
          username: true,
          email: true,
        },
        body: true,
        created_at: true,
      },
    });
    if (messages) return messages;
    throw new HttpException("Posts not found", HttpStatus.NOT_FOUND);
  }
}
