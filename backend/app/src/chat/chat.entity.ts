import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Message } from "src/message/message.entity";
import { User } from "src/user/user.entity";
import { Penalty } from "../penalty/penalty.entity";

@Entity()
export class Chatroom {
  @PrimaryGeneratedColumn({
    name: "chatroomId",
  })
  public id!: number;

  @Column({
    nullable: false,
    default: "public",
  })
  public type!: string;
  // public, private, password

  @Column({
    nullable: true,
  })
  public password!: string; // needs hashing

  @Column({
    nullable: false,
  })
  public chatroomName!: string;

  // if DM and a request to play a game is made
  @Column({
    default: 0,
  })
  public gameRequestByUserId!: number;

  // shows messages belonging to this chatroom
  @OneToMany(() => Message, (message: Message) => message.chatroomId, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn()
  public message!: Message[];

  @OneToMany(() => Penalty, (penalty: Penalty) => penalty.chatroom, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn()
  public penalty!: Penalty[];

  @ManyToOne(() => User, (owner: User) => owner.chatroomOwner, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  owner!: User;

  @ManyToMany(() => User, (member: User) => member.chatroomMember, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  member!: User[];

  @ManyToMany(() => User, (admin: User) => admin.chatroomAdmin, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  admin!: User[];
}
