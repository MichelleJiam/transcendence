export interface Canvas {
  width: number;
  height: number;
  offset: number;
  borderLines: number;
}

export interface Player {
  id?: string;
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

// combine Game elements into GameRoom or vice versa
export interface GameRoom {
  room: string;
  player: number;
  paddleOne: Paddle;
  paddleTwo: Paddle;
  ball: Ball;
  view: Canvas;
}

// export interface Game {
//   id: string;
//   player: number;
//   playerOne: number;
//   playerTwo: number;
//   state: number;
// }

export interface Game {
  id: number;
  player: number;
  playerOne: number;
  playerTwo: number;
  winnerId?: number;
  loserId?: number;
  winnerScore?: number;
  loserScore?: number;
  state: number;
}
