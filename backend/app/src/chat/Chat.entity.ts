import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	ManyToMany,
	PrimaryGeneratedColumn,
  } from "typeorm";
  import { Message } from "src/message/Message.entity";
  import { User } from "src/user/User.entity";
  
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
  
	// shows admins of the chat
	@ManyToMany(() => User, (user: User) => user.chatroomAdmin)
	@JoinColumn()
	public admin!: User[];
  
	// shows members in chat
	@ManyToMany(() => User, (user: User) => user.chatroomMember)
	@JoinColumn()
	public member!: User[];
  
	// shows messages belonging to this chatroom
	@JoinColumn()
	@OneToMany(() => Message, (messages: Message) => messages.chatroomId)
	public messages!: Message[];
  }
  