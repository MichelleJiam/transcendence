import { Chatroom } from "src/chat/chat.entity";
import { Message } from "src/message/message.entity";
import { Avatar } from "src/avatar/avatar.entity";
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

  // add owner entity
  @OneToMany(() => Chatroom, (chatroom: Chatroom) => chatroom.owner)
  @JoinColumn()
  public chatroomOwner!: Chatroom[];

  //link message table to user
  @OneToMany(() => Message, (messages: Message) => messages.userId)
  @JoinColumn()
  public messages!: Message[];

  @ManyToMany(() => Penalty)
  @JoinColumn()
  public penalty!: Penalty[];

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
}
