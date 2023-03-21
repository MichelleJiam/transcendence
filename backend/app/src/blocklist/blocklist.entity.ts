import { User } from "src/user/user.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity()
export class Blocklist {
  @PrimaryGeneratedColumn({
    name: "BlockId",
  })
  id!: number;

  @ManyToOne(() => User, (user: User) => user.blocklistOwner)
  blocklistOwner!: User;

  @ManyToOne(() => User, (user: User) => user.blockedUser)
  blockedUser!: User;
}
