import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "src/user/User.entity";

@Entity()
export class Message {
  @PrimaryGeneratedColumn({
    name: "messageId",
  })
  public id?: number;

  @Column({
    nullable: false,
  })
  public body = "";

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (userId: User) => userId.messages)
  @JoinColumn()
  public userId: User;
}
