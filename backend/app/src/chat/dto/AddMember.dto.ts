import { User } from "src/user/User.entity";
import { DeepPartial } from "typeorm";

export class AddMemberDto {
  member!: DeepPartial<User[]>;
}