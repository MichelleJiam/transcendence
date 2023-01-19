import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "src/user/user.entity";
import { Chatroom } from "src/chat/chat.entity";

@Entity()
export class Message {
  @PrimaryGeneratedColumn({
    name: "messageId",
  })
  public id!: number;

  @Column({
    nullable: false,
  })
  public body!: string;

  @CreateDateColumn()
  createdAt!: Date;

  // relationships
  @ManyToOne(() => User, (userId: User) => userId.message, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn()
  public userId!: User;

  @ManyToOne(() => Chatroom, (chatroomId: Chatroom) => chatroomId.message, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn()
  public chatroomId!: Chatroom;
}
