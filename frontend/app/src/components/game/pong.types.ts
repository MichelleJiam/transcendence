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
  id?: number;
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
  room: string;
  player: number;
  winner: number;
  playerOne: Player;
  playerTwo: Player;
  ball: Ball;
  view: Canvas;
}

export interface Game {
  id: number;
  player: number;
  playerOne: number;
  playerTwo: number;
  state: number;
}

export interface Keys {
  up: boolean;
  down: boolean;
}
