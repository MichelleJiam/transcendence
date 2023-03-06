import { User } from "src/user/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Leaderboard {
  @PrimaryGeneratedColumn({
    name: "leaderboardId",
  })
  public id!: number;

  @OneToOne(() => User, (user: User) => user.leaderboard, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  public user!: User;

  @Column({
    default: 0,
    name: "leaderboardWins",
  })
  public wins!: number;

  @Column({
    default: 0,
    name: "leaderboardLosses",
  })
  public losses!: number;

  @Column({
    default: 1500,
  })
  public rate!: number;
}
