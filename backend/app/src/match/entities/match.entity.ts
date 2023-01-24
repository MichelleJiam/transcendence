import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Match {
  @PrimaryGeneratedColumn({})
  public id!: number;

  @Column("int", { array: true })
  public players!: number[];
}
