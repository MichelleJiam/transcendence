import { Message } from "src/message/message.entity";
import { Avatar } from "src/avatar/avatar.entity";
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    name: "userId", // alias for the column
  })
  public id!: number;

  @Column({
    unique: true,
    nullable: false,
  })
  public playerName!: string;
  // public username!: string;

  // @Column({
  //   unique: true,
  //   nullable: false, // column cannot be empty
  // })
  // public email!: string; // email must be unique

  @Column({
    nullable: false,
  })
  public password!: string; // TODO: remove once 42Auth implemented

  //link message table to user
  @JoinColumn()
  @OneToMany(() => Message, (messages: Message) => messages.userId)
  public messages!: Message[];

  @Column({
    type: "boolean",
    default: false,
  })
  public twoFA!: boolean;

  @JoinColumn({ name: "avatarId" })
  @OneToOne(() => Avatar, {
    nullable: true,
  })
  @Column({ nullable: true })
  public avatarId?: number;

  // @OneToOne(() => Avatar, {
  //   nullable: true,
  // })
  // public avatar?: Avatar;
  // @JoinColumn({ name: "avatarId" })
  // @Column({ nullable: true })
  // public avatarId?: number;

  // @OneToOne(() => Avatar)
  // @JoinColumn()
  // avatar?: Avatar;
}
