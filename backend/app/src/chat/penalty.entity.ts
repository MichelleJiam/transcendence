import { User } from "src/user/user.entity";
import {
  Column,
  Entity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Chatroom } from "./chat.entity";

@Entity()
export class Penalty {
  @Column({
    nullable: false,
  })
  public userId?: User;

  @CreateDateColumn()
  bannedAt?: Date;

  @ManyToOne(() => Chatroom, (chatroom: Chatroom) => chatroom.mute)
  @JoinColumn()
  mutedFrom?: Chatroom;

  @ManyToOne(() => Chatroom, (chatroom: Chatroom) => chatroom.ban)
  @JoinColumn()
  bannedFrom?: Chatroom;
}
