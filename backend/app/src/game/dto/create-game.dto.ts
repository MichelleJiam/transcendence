export class CreateGameDto {
  id!: number;
  playerOne!: number;
  playerTwo!: number;
  winnerId!: number;
  loserId!: number;
  winnerScore!: number;
  loserScore!: number;
  status!: string;
}
