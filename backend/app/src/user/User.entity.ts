import { Chatroom } from "src/chat/Chat.entity";
import { Message } from "src/message/Message.entity";
// import { Chatroom } from "src/chat/chat.entity";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    name: "userId", // alias for the column
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

  // add owner entity

  //link message table to user
  @JoinColumn()
  @OneToMany(() => Message, (messages: Message) => messages.userId)
  public messages!: Message[];

  @ManyToMany(() => Chatroom, (chatroom: Chatroom) => chatroom.admin, {
    cascade: true,
  })
  @JoinTable()
  public chatroomAdmin!: Chatroom[];

  @ManyToMany(() => Chatroom, (chatroom: Chatroom) => chatroom.member, {
    cascade: true,
  })
  @JoinTable()
  public chatroomMember!: Chatroom[];
}
