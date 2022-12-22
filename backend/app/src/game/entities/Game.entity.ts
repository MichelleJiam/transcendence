import { User } from "src/user/User.entity";
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Game {
  @PrimaryGeneratedColumn({
    name: "gameId",
  })
  public id!: number;

  @Column({
    nullable: false,
  })
  public winnerId!: number;

  @Column({
    nullable: false,
  })
  public loserId!: number;

  @Column({
    nullable: false,
  })
  public winnerScore!: number;

  @Column({
    nullable: false,
  })
  public loserScore!: number;

  // one game to many users
  @JoinColumn()
  @OneToMany(() => User, (users: User) => users.gameId)
  public users!: User[];
}
