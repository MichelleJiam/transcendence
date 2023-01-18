import { User } from "src/user/user.entity";
import { Entity, ManyToOne, PrimaryColumn } from "typeorm";

/* Friend is also referred to as relation */

@Entity()
export class Friend {
  @PrimaryColumn()
  @ManyToOne(() => User, (user: User) => user.source)
  source!: number;

  @PrimaryColumn()
  @ManyToOne(() => User, (user: User) => user.target)
  target!: number;

  @PrimaryColumn()
  status!: string;
}

/*  A FEW NOTES

**  The Friend entity is a relation that consists of two users
**  The user is either the source (sender of friend request) or the target (receiver of friend request)
**  @ManyToOne generates a column holding a primary key to a user
**  One user can have many related instanced of Friend (relations) but the source and target can only be related to a single user
**  
**  Paramaters @ManyToOne:
**  1) function that returns the type of a relation "() => User"
**  2) function with one argument of the related type "(user: User) => user.source)"
*/
