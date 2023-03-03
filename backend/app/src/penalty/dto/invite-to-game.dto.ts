import { IsNotEmpty } from "class-validator";

export class InviteToGameDto {
  @IsNotEmpty()
  playerOne!: number;

  @IsNotEmpty()
  playerTwo!: number;

  @IsNotEmpty()
  status!: string; // accept | reject | waiting
}
