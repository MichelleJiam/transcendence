import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToOne,
} from "typeorm";
import { Message } from "src/message/message.entity";
import { User } from "src/user/user.entity";
import { Penalty } from "../penalty/penalty.entity";

@Entity()
export class Chatroom {
  @PrimaryGeneratedColumn({
    name: "chatroomId",
  })
  public id?: number;

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

  // shows owner of the chatroom
  @ManyToOne(() => User, (userId: User) => userId.chatroomOwner)
  @JoinColumn()
  public owner!: User;

  // shows admins of the chat
  @ManyToMany(() => User)
  @JoinColumn()
  public admin!: User[];

  // shows members in chat
  @ManyToMany(() => User)
  @JoinColumn()
  public member!: User[];

  // shows messages belonging to this chatroom
  @OneToMany(() => Message, (messages: Message) => messages.chatroomId)
  @JoinColumn()
  public messages!: Message[];

  @ManyToMany(() => Penalty)
  @JoinColumn()
  public penalty!: Penalty[];
}
