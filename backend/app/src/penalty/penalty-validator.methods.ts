import { Chatroom } from "src/chat/chat.entity";
import { DeepPartial } from "typeorm";
import { CreatePenaltyDto } from "./dto/create-penalty.dto";
import { Penalty } from "./penalty.entity";

export function validatePenaltyDto(
  createPenaltyDto: CreatePenaltyDto,
): boolean {
  if (
    (createPenaltyDto.penaltyType == "mute" ||
      createPenaltyDto.penaltyType == "ban") &&
    Object.keys(createPenaltyDto.chatroom).length !== 0 &&
    Object.keys(createPenaltyDto.user).length !== 0
  ) {
    return true;
  }
  return false;
}

export function validateAdmin(
  newPenalty: Penalty,
  createPenaltyDto: CreatePenaltyDto,
): boolean {
  for (let i = 0; i < newPenalty.chatroom.admin.length; i++) return true;
  return false;
}
