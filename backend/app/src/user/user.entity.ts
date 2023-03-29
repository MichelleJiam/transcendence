import { Chatroom } from "src/chat/chat.entity";
import { Message } from "src/message/message.entity";
import { Avatar } from "src/avatar/avatar.entity";
import { Game } from "src/game/entities/game.entity";

export enum UserStatus {
  ONLINE,
  OFFLINE,
  GAME,
}

import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Penalty } from "src/penalty/penalty.entity";
import { Blocklist } from "src/blocklist/blocklist.entity";
import { Friend } from "src/friend/friend.entity";
import { Achievement } from "src/achievement/achievement.entity";
import { Leaderboard } from "src/leaderboard/leaderboard.entity";

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

  /*******
   * 2FA *
   *******/

  @Column({
    type: "boolean",
    default: false,
  })
  public twoFAEnabled!: boolean;

  @Column({ nullable: true })
  public twoFASecret?: string;

  /**********
   * AVATAR *
   **********/

  @JoinColumn({ name: "avatarId" })
  @OneToOne(() => Avatar, {
    nullable: true,
  })
  @Column({ nullable: true })
  public avatarId?: number;

  /**********
   * STATUS *
   **********/

  @Column({
    name: "userStatus",
    default: UserStatus.OFFLINE,
  })
  public status!: number;

  /********
   * CHAT *
   ********/

  @OneToMany(() => Message, (message: Message) => message.userId)
  @JoinColumn()
  public message!: Message[];

  @OneToMany(() => Penalty, (penalty: Penalty) => penalty.user)
  @JoinColumn()
  public penalty!: Penalty[];

  @OneToMany(
    () => Blocklist,
    (blocklist: Blocklist) => blocklist.blocklistOwner,
  )
  @JoinColumn()
  public blocklistOwner!: Blocklist[];

  @OneToMany(() => Blocklist, (blocklist: Blocklist) => blocklist.blockedUser)
  @JoinColumn()
  public blockedUser!: Chatroom[];

  @OneToMany(() => Chatroom, (chatroom: Chatroom) => chatroom.owner)
  @JoinColumn()
  public chatroomOwner!: Chatroom[];

  @ManyToMany(() => Chatroom, (chatroom: Chatroom) => chatroom.member)
  @JoinTable()
  public chatroomMember!: Chatroom[];

  @ManyToMany(() => Chatroom, (chatroom: Chatroom) => chatroom.admin)
  @JoinTable()
  public chatroomAdmin!: Chatroom[];

  /***************
   * LEADERBOARD *
   ***************/

  @OneToOne(() => Leaderboard, (leaderboard: Leaderboard) => leaderboard.user)
  @JoinColumn()
  public leaderboard!: Leaderboard;

  /***********
   * FRIENDS *
   ***********/

  @OneToMany(() => Friend, (friend: Friend) => friend.source)
  source!: Friend[]; // array of relations where the user is the source (sender of friend request)

  @OneToMany(() => Friend, (friend: Friend) => friend.target)
  target!: Friend[]; // array of relations where the user is the target (receiver of friend request)

  /*********
   * GAMES *
   *********/

  @JoinColumn()
  @OneToMany(() => Game, (games: Game) => games.winnerId, {
    nullable: true,
  })
  public wins!: Game[];

  @JoinColumn()
  @OneToMany(() => Game, (games: Game) => games.loserId, {
    nullable: true,
  })
  public losses!: Game[];

  /****************
   * ACHIEVEMENTS *
   ****************/

  @ManyToMany(
    () => Achievement,
    (achievement: Achievement) => achievement.users,
    { onUpdate: "CASCADE" },
  )
  @JoinTable()
  achievements!: Achievement[];
}
