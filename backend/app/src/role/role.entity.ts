import { Chatroom } from "src/chat/chat.entity";
import { User } from "src/user/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Role {
  @PrimaryGeneratedColumn({
    name: "roleId",
  })
  id!: number;

  @Column({
    nullable: false,
  })
  public roleName!: string;

  // relationships
  // @ManyToMany(() => User, (user: User) => user.role, { cascade: true })
  // public user!: User[];

  // @ManyToOne(() => Chatroom, (chatroom: Chatroom) => chatroom.role, {
  //   cascade: true,
  // })
  // chatroom!: Chatroom;
}
