import { User } from "src/user/user.entity";
import { DeepPartial } from "typeorm";

export class AddAdminDto {
  admin!: DeepPartial<User[]>;
}
