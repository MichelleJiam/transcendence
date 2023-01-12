import { User } from "src/user/user.entity";

export class CreateGameDto {
  playerOne!: number;
  playerTwo!: number;
  winnerId!: User;
  loserId!: User;
  winnerScore!: number;
  loserScore!: number;
  status!: string;
  // users!: number[];
}

/* list all properties we expect */
