import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/user.entity";

@Entity()
export class Message {
	@PrimaryGeneratedColumn({
		name: 'message_id'
	})
	public id?: number;

	@Column({
		nullable: false,
	})
	public body: string;

	@CreateDateColumn()
	created_at: Date;

	@ManyToOne(() => User, (user_id: User) => user_id.messages)
	@JoinColumn()
	public user_id: User;
}