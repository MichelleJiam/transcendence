import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
  } from "typeorm";
  import { User } from "src/user/User.entity";
  import { Chatroom } from "src/chat/Chat.entity";
  
  @Entity()
  export class Message {
	@PrimaryGeneratedColumn({
	  name: "message_id",
	})
	public id?: number;
  
	@Column({
	  nullable: false,
	})
	public body!: string;
  
	@CreateDateColumn()
	created_at!: Date;
  
	@ManyToOne(() => User, (userId: User) => userId.messages)
	@JoinColumn()
	public userId!: User;
  
	@ManyToOne(() => Chatroom, (chatroomId: Chatroom) => chatroomId.messages)
	@JoinColumn()
	public chatroomId!: Chatroom;
  }
  