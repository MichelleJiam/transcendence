import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Game {
  @PrimaryGeneratedColumn({
    name: "gameId",
  })
  public id!: number;

  @Column({
    nullable: true,
  })
  public playerOne!: number;

  @Column({
    nullable: true,
  })
  public playerTwo!: number;

  @Column({
    nullable: true,
  })
  public winnerScore!: number;

  @Column({
    nullable: true,
  })
  public loserScore!: number;

  @Column({
    nullable: true,
  })
  public status!: string;

  @ManyToOne(() => User, (user: User) => user.wins)
  public winnerId!: number;

  @ManyToOne(() => User, (user: User) => user.losses)
  public loserId!: number;
}

/* 
  lazy loading - lets you load the main entity and then load the relations on demand; field has to be wrapped in a promise
  eager loading - relations are always fetched along the parent entity
  use that when you know you will need all the data; performed by using an SQL join to the related table 
*/
