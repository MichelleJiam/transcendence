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

  // lazy loading - lets you load the main entity and then load the relations on demand; field has to be wrapped in a promise
  // eager loading - relations are always fetched along the parent entity
  // use that when you know you will need all the data; performed by using an SQL join to the related table
  @OneToMany(() => Game, (games: Game) => games.winnerId, {
    eager: true,
  })
  public wins!: Game[];

  @OneToMany(() => Game, (games: Game) => games.loserId)
  public losses!: Game[];
}
// this is his attendee: Attendee[]
// many users to one game
// @JoinColumn()
// @ManyToOne(() => Game, (gameId: Game) => gameId.users)
// public gameId!: Game;
