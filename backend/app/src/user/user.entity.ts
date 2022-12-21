import { Message } from "src/message/message.entity";
import { Game } from "src/game/entities/game.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    name: "user_id", // alias for the column
  })
  public id?: number;

  @Column({
    nullable: false,
  })
  public username!: string;

  @Column({
    unique: true,
    nullable: false, // column cannot be empty
  })
  public email!: string; // email must be unique

  @Column({
    nullable: false,
  })
  public password!: string;

  //link message table to user
  @JoinColumn()
  @OneToMany(() => Message, (messages: Message) => messages.userId)
  public messages!: Message[];

  // many users to one game
  @JoinColumn()
  @ManyToOne(() => Game, (gameId: Game) => gameId.users)
  public gameId!: Game;
}
