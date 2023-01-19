import { IsNotEmpty } from "class-validator";
import { User } from "src/user/user.entity";
import { DeepPartial } from "typeorm";
import { Chatroom } from "../../chat/chat.entity";

export class CreatePenaltyDto {
  @IsNotEmpty()
  penaltyType!: string;

  @IsNotEmpty()
  user!: number;

  @IsNotEmpty()
  chatroom!: number;
}
