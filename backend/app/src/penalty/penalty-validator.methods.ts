import { Chatroom } from "src/chat/chat.entity";
import { DeepPartial } from "typeorm";
import { CreatePenaltyDto } from "./dto/create-penalty.dto";
import { Penalty } from "./penalty.entity";

export function validatePenaltyDto(
  createPenaltyDto: CreatePenaltyDto,
): boolean {
  if (
    createPenaltyDto.penaltyType !== "mute" &&
    createPenaltyDto.penaltyType !== "ban"
  ) {
    return false;
  }
  return true;
}
