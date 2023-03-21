import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Game {
  @PrimaryGeneratedColumn({
    name: "gameId",
  })
  public id!: number;

  @Column({
    nullable: true,
  })
  public playerOne!: number;

  @Column({
    nullable: true,
  })
  public playerTwo!: number;

  @Column({
    nullable: true,
  })
  public playerOneSocket!: string;

  @Column({
    nullable: true,
  })
  public playerTwoSocket!: string;

  @Column({
    nullable: true,
  })
  public winnerScore!: number;

  @Column({
    nullable: true,
  })
  public loserScore!: number;

  @Column({
    nullable: true,
  })
  public join!: boolean;

  @Column({
    nullable: true,
  })
  public state!: string;

  @ManyToOne(() => User, (user: User) => user.wins)
  public winnerId!: number;

  @ManyToOne(() => User, (user: User) => user.losses)
  public loserId!: number;
}
