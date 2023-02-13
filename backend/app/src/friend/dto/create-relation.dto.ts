import { IsIn, IsInt } from "class-validator";

export type RelationStatus = "FRIEND" | "PENDING";

const relationStatus = ["FRIEND", "PENDING"];

export class CreateRelationDto {
  @IsInt()
  source!: number;

  @IsInt()
  target!: number;

  @IsIn(relationStatus)
  status!: RelationStatus;
}

export class Relation extends CreateRelationDto {}
