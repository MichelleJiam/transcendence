import { Chatroom } from "src/chat/chat.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

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
  @ManyToMany(() => User, (user: User) => user.role)
  public user!: User[];

  @ManyToMany(() => Chatroom, (chatroom: Chatroom) => chatroom.role)
  public chatroom!: Chatroom[];
}
