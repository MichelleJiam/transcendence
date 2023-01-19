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

  // relationships for chat START
  @OneToMany(() => Message, (message: Message) => message.userId)
  @JoinColumn()
  public message!: Message[];

  @OneToMany(() => Penalty, (penalty: Penalty) => penalty.user)
  @JoinColumn()
  public penalty!: Penalty[];

  @OneToMany(() => Chatroom, (chatroom: Chatroom) => chatroom.owner)
  @JoinColumn()
  public chatroomOwner!: Chatroom[];

  @ManyToMany(() => Chatroom, (chatroom: Chatroom) => chatroom.member)
  @JoinTable()
  public chatroomMember!: Chatroom[];

  @ManyToMany(() => Chatroom, (chatroom: Chatroom) => chatroom.admin)
  @JoinTable()
  public chatroomAdmin!: Chatroom[];

  // relationships for chat END

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
