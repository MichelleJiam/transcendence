import { User } from "src/user/user.entity";
import {
  Column,
  Entity,
  CreateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
} from "typeorm";
import { Chatroom } from "../chat/chat.entity";

@Entity()
export class Penalty {
  @PrimaryGeneratedColumn({
    name: "penaltyId",
  })
  id?: number;

  @CreateDateColumn()
  time?: Date;

  @Column({
    nullable: false,
  })
  penaltyType!: string;

  // relationships
  @ManyToMany(() => User, (user: User) => user.penalty)
  user!: User[];

  @ManyToMany(() => Chatroom, (chatroom: Chatroom) => chatroom.penalty)
  chatroom!: Chatroom[];
}
