import { IsIn, IsInt } from "class-validator";

export type RelationStatus = "FRIEND" | "PENDING" | "BLOCKED";

const relationStatus = ["FRIEND", "PENDING", "BLOCKED"];

export class CreateRelationDto {
  @IsInt()
  source!: number;

  @IsInt()
  target!: number;

  @IsIn(relationStatus)
  status!: RelationStatus;
}
