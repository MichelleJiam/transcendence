export interface Canvas {
  width: number;
  height: number;
  offset: number;
  borderLines: number;
}

export interface Player {
  id: string;
  score: number;
  paddle: Paddle;
}

export interface Paddle {
  height: number;
  width: number;
  y: number;
  offset: number;
}

export interface Ball {
  radius: number;
  x: number;
  y: number;
  moveX: number;
  moveY: number;
}

export interface Keys {
  up: boolean;
  down: boolean;
}
