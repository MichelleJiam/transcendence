import { IsNotEmpty } from "class-validator";
import { User } from "src/user/user.entity";
import { DeepPartial } from "typeorm";
import { Chatroom } from "../chat.entity";
import { Penalty } from "../penalty.entity";
export class BanUserDto {
  ban!: Penalty;

  @IsNotEmpty()
  userId!: DeepPartial<User[]>;

  @IsNotEmpty()
  bannedFrom!: DeepPartial<Chatroom[]>;
}
