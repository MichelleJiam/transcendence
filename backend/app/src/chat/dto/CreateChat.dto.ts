import { IsNotEmpty } from "class-validator";
import { DeepPartial } from "typeorm";
import { User } from "src/user/User.entity";

export class CreateChatroomDto {
  @IsNotEmpty()
  type!: string;

  @IsNotEmpty()
  chatroomName!: string;

  password!: string;

  admin!: DeepPartial<User[]>;

  member!: DeepPartial<User[]>;
}