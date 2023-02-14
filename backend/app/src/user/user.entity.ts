import { Message } from "src/message/message.entity";
import { Avatar } from "src/avatar/avatar.entity";
import { Game } from "src/game/entities/game.entity"

export enum UserStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  GAME = "game",
  MATCHMAKING = "matchmaking",
}

import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Friend } from "src/friend/friend.entity";

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

  /* user status */

  @Column({
    name: "userStatus",
    type: "enum",
    enum: UserStatus,
    default: UserStatus.OFFLINE,
  })
  public status!: UserStatus;

  /* user friends */

  @OneToMany(() => Friend, (friend: Friend) => friend.source)
  source!: Friend[]; // array or relations where the user is the source (sender of friend request)

  @OneToMany(() => Friend, (friend: Friend) => friend.target)
  target!: Friend[]; // array of relations where the user is the target (receiver of friend request)

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
