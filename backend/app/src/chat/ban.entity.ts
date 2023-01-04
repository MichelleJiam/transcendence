import { User } from "src/user/User.entity";
import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
  } from "typeorm";

  @Entity()
  export class Ban {
	@Column({
		nullable: false,
	})
	public userId!: User;

	@CreateDateColumn()
	bannedAt
  }