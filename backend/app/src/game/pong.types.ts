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
  socket: string;
  score: number;
  paddle: Paddle;
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
  intervalId?: ReturnType<typeof setInterval>;
  state: number;
}
