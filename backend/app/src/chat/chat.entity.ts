import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinTable,
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

  // shows messages belonging to this chatroom
  @OneToMany(() => Message, (message: Message) => message.chatroomId)
  @JoinColumn()
  public message!: Message[];

  @ManyToMany(() => Penalty, (penalty: Penalty) => penalty.chatroom, {
    cascade: true,
  })
  @JoinTable()
  public penalty!: Penalty[];

  @ManyToOne(() => User, (owner: User) => owner.chatroomOwner, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  owner!: User;

  @ManyToMany(() => User, (member: User) => member.chatroomMember)
  member!: User[];

  @ManyToMany(() => User, (admin: User) => admin.chatroomAdmin)
  admin!: User[];
}
