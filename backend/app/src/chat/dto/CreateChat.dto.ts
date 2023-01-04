import { IsNotEmpty } from "class-validator";
import { DeepPartial } from "typeorm";
import { User } from "src/user/User.entity";

export class CreateChatroomDto {
  @IsNotEmpty()
  type!: string;

  @IsNotEmpty()
  chatroomName!: string;

  password!: string;

  @IsNotEmpty()
  owner!: DeepPartial<User[]>;

  @IsNotEmpty()
  admin!: DeepPartial<User[]>;

  @IsNotEmpty()
  member!: DeepPartial<User[]>;
}
