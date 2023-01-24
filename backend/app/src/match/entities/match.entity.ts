import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Match {
  @PrimaryGeneratedColumn({})
  public id!: number;

  @Column({
    nullable: true,
  })
  public playerId!: number;

  /* maybe also store if they want to use special features, aka game type */
}
