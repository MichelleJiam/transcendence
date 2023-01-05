import { IsNotEmpty } from "class-validator";
import { User } from "src/user/user.entity";
import { DeepPartial } from "typeorm";
import { Chatroom } from "../chat.entity";
import { UpdateChatroomDto } from "./update-chat.dto";

export class BanUserDto extends UpdateChatroomDto {
  @IsNotEmpty()
  userId!: DeepPartial<User[]>;

  @IsNotEmpty()
  bannedFrom!: DeepPartial<Chatroom[]>;
}
