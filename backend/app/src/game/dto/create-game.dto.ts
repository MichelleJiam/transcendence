import { User } from "src/user/user.entity";

export class CreateGameDto {
  id!: number;
  playerOne!: number;
  playerTwo!: number;
  winnerId!: User;
  loserId!: User;
  winnerScore!: number;
  loserScore!: number;
  status!: string;
}
