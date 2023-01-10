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
import { Role } from "src/role/role.entity";

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

  // shows messages belonging to this chatroom
  @OneToMany(() => Message, (message: Message) => message.chatroomId)
  @JoinColumn()
  public message!: Message[];

  @ManyToMany(() => Penalty, (penalty: Penalty) => penalty.chatroom)
  @JoinColumn()
  public penalty!: Penalty[];

  @ManyToMany(() => User, (user: User) => user.chatroom)
  user!: User[];

  @ManyToMany(() => Role, (role: Role) => role.chatroom)
  @JoinColumn()
  role!: Role[];
}
