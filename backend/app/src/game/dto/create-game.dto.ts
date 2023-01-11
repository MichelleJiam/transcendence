export class CreateGameDto {
  winnerId!: number;
  loserId!: number;
  winnerScore!: number;
  loserScore!: number;
  status!: string;
  users!: number[];
}

/* list all properties we expect */
