import { IsNotEmpty } from "class-validator";
import { User } from "src/user/user.entity";
import { DeepPartial } from "typeorm";
import { Chatroom } from "../../chat/chat.entity";

export class CreatePenaltyDto {
  @IsNotEmpty()
  user!: DeepPartial<User>;

  @IsNotEmpty()
  penaltyType!: string;

  @IsNotEmpty()
  chatroom!: DeepPartial<Chatroom>;
}
