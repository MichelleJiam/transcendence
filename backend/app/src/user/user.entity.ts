import { Message } from "src/message/message.entity";
import { Avatar } from "src/avatar/avatar.entity";
import { Game } from "src/game/entities/game.entity";

import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    name: "userId", // alias for the column
  })
  public id!: number;

  @Column({
    unique: true,
    nullable: false,
  })
  intraId!: string;

  @Column({
    unique: true,
    nullable: true,
  })
  public playerName!: string;

  @Column({
    nullable: false,
  })
  public password!: string; // TODO: remove once 42Auth implemented

  //link message table to user
  @JoinColumn()
  @OneToMany(() => Message, (messages: Message) => messages.userId)
  public messages!: Message[];

  @Column({
    type: "boolean",
    default: false,
  })
  public twoFA!: boolean;

  @JoinColumn({ name: "avatarId" })
  @OneToOne(() => Avatar, {
    nullable: true,
  })
  @Column({ nullable: true })
  public avatarId?: number;

  // @Column({
  //   unique: true,
  //   nullable: false, // column cannot be empty
  // })
  // public email!: string; // email must be unique

  @JoinColumn()
  @OneToMany(() => Game, (games: Game) => games.winnerId, {
    eager: true,
    nullable: true,
  })
  public wins!: Game[];

  @JoinColumn()
  @OneToMany(() => Game, (games: Game) => games.loserId, {
    eager: true,
    nullable: true,
  })
  public losses!: Game[];
}
