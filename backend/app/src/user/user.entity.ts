import { Message } from "src/message/message.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn({
		name: 'user_id' // alias for the column
	})
	public id?: number;

	@Column({
		nullable: false
	})
	public username: string;

	@Column({
		unique: true,
		nullable: false, // column cannot be empty
	})
	public email: string; // email must be unique

	@Column({
		nullable: false
	})
	public password: string;

	//link message table to user
	@JoinColumn()
	@OneToMany(() => Message, (messages: Message) => messages.user_id)
	public messages: Message[];
}
