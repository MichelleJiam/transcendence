import { User } from "src/user/user.entity";
import { DeepPartial } from "typeorm";

export class AddMemberDto {
  member!: DeepPartial<User[]>;
}
