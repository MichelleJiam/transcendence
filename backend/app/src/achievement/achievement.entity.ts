import { User } from "src/user/user.entity";
import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Achievement {
  @PrimaryColumn()
  id!: number;

  @Column({ unique: true, nullable: false })
  name!: string;

  @Column({ nullable: false })
  icon!: string;

  @ManyToMany(() => User, (user: User) => user.achievements, {
    onUpdate: "CASCADE",
  })
  users!: User[];
}

/*
 ** A many-to-many relationship exists between user and achievement.
 ** A user may have earned 0, 1 or more achievements and an
 ** achievement may have been earned by 0, 1 or more users
 */
