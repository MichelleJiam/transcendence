import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity() /* could name the table games */
export class Game {
  @PrimaryGeneratedColumn({
    name: "gameId",
    /* other options - type, length, nullable,unique, comment (visible in database) */
  })
  public id!: number;

  // this is his event: Event
  @ManyToOne(() => User, (user: User) => user.wins)
  public winnerId!: User;
  // @Column({
  //   nullable: true,
  // })
  // public winnerId!: number;

  /* lazy loading or eager loading*/
  @ManyToOne(() => User, (user: User) => user.losses)
  public loserId!: User;
  // @Column({
  //   nullable: true,
  // })
  // public loserId!: number;

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
}

// one game to many users
// @JoinColumn()
// @OneToMany(() => User, (users: User) => users.gameId)
// public users!: User[];
