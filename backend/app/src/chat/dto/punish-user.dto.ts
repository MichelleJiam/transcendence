import { IsNotEmpty } from "class-validator";
import { User } from "src/user/user.entity";
import { DeepPartial } from "typeorm";
import { Chatroom } from "../chat.entity";
export class BanUserDto {
  @IsNotEmpty()
  userId!: DeepPartial<User[]>;

  @IsNotEmpty()
  bannedFrom!: DeepPartial<Chatroom[]>;
}
