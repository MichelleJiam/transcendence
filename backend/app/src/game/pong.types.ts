export interface Paddle {
  height: number;
  width: number;
  y: number;
  offset: number;
}

export interface Ball {
  radius?: number;
  x?: number;
  y?: number;
  moveX?: number;
  moveY?: number;
}
