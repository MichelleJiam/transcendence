export class CreateGameDto {
  id!: number;
  playerOne!: number;
  playerTwo!: number;
  playerOneSocket!: string;
  playerTwoSocket!: string;
  winnerId!: number;
  loserId!: number;
  winnerScore!: number;
  loserScore!: number;
  state!: string;
  join!: boolean;
}
