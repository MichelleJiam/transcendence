import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chatroom } from "src/chat/chat.entity";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { CreatePenaltyDto } from "./dto/create-penalty.dto";
import { Penalty } from "./penalty.entity";

@Injectable()
export class PenaltyMethod {
  constructor(
    @InjectRepository(Penalty)
    private readonly penaltyRepository: Repository<Penalty>,
  ) {}

  getMinutesDiff(startDate: Date, endDate: Date): number {
    const msInMinute = 60 * 1000;

    return Math.round(
      Math.abs(Number(endDate) - Number(startDate)) / msInMinute,
    );
  }

  createPenaltyEntity(
    chatroom: Chatroom,
    user: User,
    createPenaltyDto: CreatePenaltyDto,
  ): Penalty {
    const newPenalty = new Penalty();
    newPenalty.chatroom = chatroom;
    newPenalty.user = user;
    newPenalty.penaltyType = createPenaltyDto.penaltyType;
    return newPenalty;
  }
}
