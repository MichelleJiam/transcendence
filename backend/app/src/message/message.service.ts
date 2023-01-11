import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateMessageDto } from "./dto/create-message.dto";
import { Message } from "./message.entity";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  getAllMessages() {
    return this.messageRepository.find({
      relations: ["userId"],
      order: {
        userId: {
          id: "asc",
        },
      },
    });
  }

  async create(createMessageDto: CreateMessageDto) {
    const newMessage = this.messageRepository.create(createMessageDto);
    return this.messageRepository.save(newMessage);
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
          playerName: true,
        },
        body: true,
        createdAt: true,
      },
    });
    if (messages) return messages;
    throw new NotFoundException("Posts not found");
  }

  // finds username and retrieves all messages from this user
  // relations links the userId column in the message entity with
  // the id in the user entity
  // where defines where username is the same as the given username
  // select shows which columns should be returned
  // https://typeorm.io/find-options#find-options
  //   async getMessageByUsername(username: string) {
  //     const messages = await this.messageRepository.find({
  //       relations: {
  //         userId: true,
  //       },
  //       where: {
  //         userId: {
  //           // username: username,
  //         },
  //       },
  //       select: {
  //         userId: {
  //           id: true,
  //         },
  //         body: true,
  //         createdAt: true,
  //       },
  //     });
  //     if (messages) return messages;
  //     throw new HttpException("Posts not found", HttpStatus.NOT_FOUND);
  //   }
}
