import { PartialType } from "@nestjs/mapped-types";
import { CreateGameDto } from "./CreateGame.dto";

export class UpdateGameDto extends PartialType(CreateGameDto) {
  id!: number;
  winnerId!: number;
  loserId!: number;
  winnerScore!: number;
  loserScore!: number;
}
