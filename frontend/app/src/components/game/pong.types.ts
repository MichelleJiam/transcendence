export interface Canvas {
  width: number;
  height: number;
  offset: number;
  borderLines: number;
}

export interface Paddle {
  height: number;
  width: number;
  y: number;
  offset: number;
}

export interface Player {
  id: number;
  socket: string;
  score: number;
  paddle: Paddle;
}

export interface Ball {
  radius: number;
  x: number;
  y: number;
  moveX: number;
  moveY: number;
}

export interface GameRoom {
  id: string;
  player: number;
  winner: number;
  loser: number;
  playerOne: Player;
  playerTwo: Player;
  ball: Ball;
  view: Canvas;
  state: number;
}

export interface Game {
  id: number;
  playerOne: number;
  playerTwo: number;
  playerOneSocket: string;
  playerTwoSocket: string;
  winnerId: number;
  loserId: number;
  winnerScore: number;
  loserScore: number;
  state: string;
}

export interface Keys {
  up: boolean;
  down: boolean;
}
