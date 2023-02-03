import { Chatroom } from "src/chat/chat.entity";
import { User } from "src/user/user.entity";
import { CreatePenaltyDto } from "./dto/create-penalty.dto";
import { Penalty } from "./penalty.entity";

export function getMinutesDiff(startDate: Date, endDate: Date): number {
  const msInMinute = 60 * 1000;
  console.log("endDate: %d", Number(endDate));
  console.log("StartDate: %d", Number(startDate));
  console.log(
    "abs of math: %d",
    Math.abs(Number(endDate) - Number(startDate)) / msInMinute,
  );
  return Math.round(Math.abs(Number(endDate) - Number(startDate)) / msInMinute);
}

export function createPenaltyEntity(
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
