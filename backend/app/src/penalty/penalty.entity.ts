import { User } from "src/user/user.entity";
import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Chatroom } from "../chat/chat.entity";

@Entity()
export class Penalty {
  @PrimaryGeneratedColumn({
    name: "penaltyId",
  })
  id!: number;

  @CreateDateColumn()
  time!: Date;

  @Column({
    nullable: false,
  })
  penaltyType!: string;

  // relationships
  @ManyToOne(() => User, (user: User) => user.penalty, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user!: User;

  @ManyToOne(() => Chatroom, (chatroom: Chatroom) => chatroom.penalty, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  chatroom!: Chatroom;
}
