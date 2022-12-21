import { User } from "src/user/User.entity";
import { DeepPartial } from "typeorm";

export class AddAdminDto {
  admin!: DeepPartial<User[]>;
}
