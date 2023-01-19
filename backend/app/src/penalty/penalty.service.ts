import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chatroom } from "src/chat/chat.entity";
import { ChatMethod } from "src/chat/chat.methods";
import { ChatService } from "src/chat/chat.service";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { CreatePenaltyDto } from "./dto/create-penalty.dto";
import { validatePenaltyDto } from "./penalty-validator.methods";
import { Penalty } from "./penalty.entity";

@Injectable()
export class PenaltyService {
  constructor(
    @InjectRepository(Penalty)
    private readonly penaltyRepository: Repository<Penalty>,
  ) {}

  async getAllPenalties() {
    const foundPenalties = await this.penaltyRepository.find({
      order: {
        id: "asc",
      },
      relations: {
        user: true,
        chatroom: true,
      },
    });
    return foundPenalties;
  }

  async getPenaltiesByChatroom(chatroomId: number) {
    const foundPenalties = await this.penaltyRepository.find({
      relations: {
        user: true,
        chatroom: true,
      },
      where: {
        chatroom: {
          id: chatroomId,
        },
      },
    });
    return foundPenalties;
  }

  async createPenalty(
    chatroom: Chatroom,
    user: User,
    createPenaltyDto: CreatePenaltyDto,
  ): Promise<Penalty> {
    if (validatePenaltyDto(createPenaltyDto) === true) {
      const newPenalty = new Penalty();
      newPenalty.chatroom = chatroom;
      newPenalty.user = user;
      newPenalty.penaltyType = createPenaltyDto.penaltyType;
      return this.penaltyRepository.save(newPenalty);
    }
    throw new HttpException("Incorrect Penalty Type.", HttpStatus.BAD_REQUEST);
  }

  // async createPenalty(createPenaltyDto: CreatePenaltyDto): Promise<Penalty> {
  //   if (validatePenaltyDto(createPenaltyDto) === true) {
  //     const newPenalty = this.penaltyRepository.create(createPenaltyDto);
  //     if (validateAdmin(newPenalty, createPenaltyDto) == false) {
  //       throw new HttpException(
  //         "unauthorised penalty giving",
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //     return this.penaltyRepository.save(newPenalty);
  //   }
  //   throw new HttpException("Unable to create penalty", HttpStatus.BAD_REQUEST);
  // }

  // async getAllPenalties(): Promise<Penalty[]> {
  //   const foundPenalties = await this.penaltyRepository.find({
  //     relations: {
  //       user: true,
  //       chatroom: true,
  //     },
  //     select: {
  //       id: true,
  //       penaltyType: true,
  //       time: true,
  //       user: {
  //         id: true,
  //         playerName: true,
  //       },
  //       chatroom: {
  //         id: true,
  //         chatroomName: true,
  //         type: true,
  //         admin: true,
  //         member: true,
  //       },
  //     },
  //   });
  //   return foundPenalties;
  // }

  // async getPenaltiesByUserId(id: number): Promise<Penalty> {
  //   const chatroom = await this.penaltyRepository.findOneBy({
  //     user: {
  //       id: id,
  //     },
  //   });
  //   if (!chatroom) {
  //     throw new HttpException("User has no penalties", HttpStatus.NOT_FOUND);
  //   }
  //   return chatroom;
  // }

  // async getPenaltiesByChatId(id: number): Promise<Penalty> {
  //   const chatroom = await this.penaltyRepository.findOneBy({
  //     chatroom: {
  //       id: id,
  //     },
  //   });
  //   if (!chatroom) {
  //     throw new HttpException(
  //       "Chatroom has no penalties",
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  //   return chatroom;
  // }
}
