import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
