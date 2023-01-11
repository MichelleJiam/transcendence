import { User } from "src/user/user.entity";
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
    nullable: true,
  })
  public winnerId!: number;

  @Column({
    nullable: true,
  })
  public loserId!: number;

  @Column({
    nullable: true,
  })
  public winnerScore!: number;

  @Column({
    nullable: true,
  })
  public loserScore!: number;

  @Column({
    nullable: false,
  })
  public status!: string;

  // one game to many users
  @JoinColumn()
  @OneToMany(() => User, (users: User) => users.gameId)
  public users!: User[];
}
