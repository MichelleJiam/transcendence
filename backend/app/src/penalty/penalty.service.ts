import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chatroom } from "src/chat/chat.entity";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { CreatePenaltyDto } from "./dto/create-penalty.dto";
import { Penalty } from "./penalty.entity";
import {
  createPenaltyEntity,
  getMinutesDiff,
  validatePenaltyDto,
} from "./penalty.method";

@Injectable()
export class PenaltyService {
  constructor(
    @InjectRepository(Penalty)
    private readonly penaltyRepository: Repository<Penalty>,
  ) {}

  async getAllPenalties(): Promise<Penalty[]> {
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

  async getPenaltiesByChatroom(chatroomId: number): Promise<Penalty[]> {
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

  async findBan(chatroomId: number, userId: number): Promise<Penalty | null> {
    const foundBan = await this.penaltyRepository.findOne({
      relations: {
        user: true,
        chatroom: true,
      },
      where: {
        penaltyType: "ban",
        user: {
          id: userId,
        },
        chatroom: {
          id: chatroomId,
        },
      },
    });
    return foundBan;
  }

  async isBannedFromChatroom(
    chatroomId: number,
    userId: number,
  ): Promise<boolean> {
    const foundBan = await this.findBan(chatroomId, userId);
    if (foundBan) {
      const banDate = foundBan.time;
      if (banDate !== undefined) {
        const currentTime = new Date();
        if (getMinutesDiff(currentTime, banDate) < 2) return true;
      }
    }
    return false;
  }

  async findMute(chatroomId: number, userId: number): Promise<Penalty | null> {
    const foundMute = await this.penaltyRepository.findOne({
      relations: {
        user: true,
        chatroom: true,
      },
      where: {
        penaltyType: "mute",
        user: {
          id: userId,
        },
        chatroom: {
          id: chatroomId,
        },
      },
    });
    return foundMute;
  }

  async isMutedFromChatroom(
    chatroomId: number,
    userId: number,
  ): Promise<boolean> {
    const foundMute = await this.findMute(chatroomId, userId);
    if (foundMute) {
      const muteDate = foundMute.time;
      if (muteDate !== undefined) {
        const currentTime = new Date();
        if (getMinutesDiff(currentTime, muteDate) < 2) return true;
      }
    }
    return false;
  }

  async createPenalty(
    chatroom: Chatroom,
    user: User,
    createPenaltyDto: CreatePenaltyDto,
  ): Promise<Penalty> {
    if (validatePenaltyDto(createPenaltyDto) === true) {
      const newPenalty = createPenaltyEntity(chatroom, user, createPenaltyDto);
      return this.penaltyRepository.save(newPenalty);
    }
    throw new HttpException("Incorrect Penalty Type.", HttpStatus.BAD_REQUEST);
  }
}
