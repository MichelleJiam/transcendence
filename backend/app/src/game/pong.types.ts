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

export interface GameRoom {
  room: string;
  player: string;
  paddleOne: Paddle;
  paddleTwo: Paddle;
  ball: Ball;
  view: Canvas;
}
