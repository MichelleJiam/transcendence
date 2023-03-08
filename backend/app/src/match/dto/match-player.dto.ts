import { IsNotEmpty } from "class-validator";

export class MatchPlayerDto {
  @IsNotEmpty()
  id!: number;

  @IsNotEmpty()
  socketId!: string;
}
