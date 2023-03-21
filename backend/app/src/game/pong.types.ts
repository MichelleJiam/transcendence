import { Game } from "./entities/game.entity";

export interface Canvas {
  width: number;
  height: number;
  offset: number;
  borderLines: number;
}

export interface Ball {
  radius: number;
  x: number;
  y: number;
  moveX: number;
  moveY: number;
}

export interface Paddle {
  height: number;
  width: number;
  y: number;
  offset: number;
}

export interface Player {
  id: number;
  name: string;
  socket: string;
  score: number;
  paddle: Paddle;
  disconnected: boolean;
}

export interface GameRoom {
  id: number;
  player: number;
  winner: number;
  loser: number;
  playerOne: Player;
  playerTwo: Player;
  ball: Ball;
  view: Canvas;
  state: number;
  countdown: number;
}

export interface GameWithPlayer {
  game: Game | null;
  playerNum: number;
  playerId: number | null;
}

export interface PlayerInput {
  id: number;
  player: number;
  direction: string;
}
