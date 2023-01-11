import { IsNotEmpty } from "class-validator";
import { Chatroom } from "src/chat/chat.entity";
import { User } from "src/user/user.entity";
import { DeepPartial } from "typeorm";

export class AddRoleDto {
  @IsNotEmpty()
  roleName!: string;

  @IsNotEmpty()
  user!: DeepPartial<User>;

  @IsNotEmpty()
  chatroom!: DeepPartial<Chatroom>;
}
