export interface Paddle {
  height: number;
  width: number;
  y: number;
  offset: number;
}

export interface Keys {
  up: boolean;
  down: boolean;
  w: boolean;
  s: boolean;
}

export interface Ball {
  radius: number;
  x: number;
  y: number;
  moveX: number;
  moveY: number;
}

export interface Canvas {
  width: number;
  height: number;
  offset: number;
  borderLines: number;
}

export interface Player {
  id: number;
  score: number;
  paddle?: Paddle;
}
