import { User } from "src/user/user.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Blocklist {
  @PrimaryGeneratedColumn({
    name: "BlockId",
  })
  id?: number;

  // relationships
  @ManyToOne(() => User, (user: User) => user.blocklist)
  user!: User;

  @OneToMany(() => User, (user: User) => user.blocked)
  blockedUser!: User[];
}
