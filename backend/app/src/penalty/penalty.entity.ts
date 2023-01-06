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

  // @ManyToMany(() => User)
  // @Column({
  //   nullable: false,
  // })
  // user!: User[];

  @CreateDateColumn()
  time?: Date;

  @Column({
    nullable: false,
  })
  penaltyType!: string;

  // @ManyToMany(() => Chatroom)
  // @JoinColumn()
  // chatroom!: Chatroom[];
}
