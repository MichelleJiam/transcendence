import { Chatroom } from "src/chat/Chat.entity";
import { Message } from "src/message/Message.entity";
<<<<<<< HEAD
// import { Chatroom } from "src/chat/chat.entity";
=======
import { Avatar } from "src/avatar/avatar.entity";
>>>>>>> 84f48f5d57180e95ffc2362fae56a71a0d24623f
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

<<<<<<< HEAD
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
=======
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

  // @OneToOne(() => Avatar, {
  //   nullable: true,
  // })
  // public avatar?: Avatar;
  // @JoinColumn({ name: "avatarId" })
  // @Column({ nullable: true })
  // public avatarId?: number;

  // @OneToOne(() => Avatar)
  // @JoinColumn()
  // avatar?: Avatar;
>>>>>>> 84f48f5d57180e95ffc2362fae56a71a0d24623f
}
