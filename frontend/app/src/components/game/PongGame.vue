<template>
  <div id="display-content">
    <canvas id="canvas" ref="game"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import type { Ball, Canvas, Keys, Paddle, GameRoom, Player } from "./pong.types";
import { Socket } from "socket.io-client";

const props = defineProps({
  id: { type: String, required: true },
  gameid: { type: String, required: true },
  player: { type: String, required: true },
  socket: { type: Socket, required: true },
});

let view: Canvas;
let ctx: CanvasRenderingContext2D;
let playerOne: Player;
let playerTwo: Player;
let paddleOne: Paddle;
let paddleTwo: Paddle;
let ball: Ball;
let key: Keys;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

onMounted(() => {
  initCanvas();
  initGame();
  drawBorderLines();
  drawCenterLine();
  drawPaddles();
  drawBall();
  intervalId = setInterval(draw, 1);
});

/*************
 * GAME LOOP *
 *************/

let intervalId = setInterval(draw, 1); // change interval to change speed; can be a feature?
clearInterval(intervalId);

/******************
 * INIT FUNCTIONS *
 *****************/

function initCanvas() {
  const canvas: HTMLCanvasElement = document.getElementById(
    "canvas"
  ) as HTMLCanvasElement;

  const dpi = window.devicePixelRatio;
  const style_height = +getComputedStyle(canvas)
    .getPropertyValue("height")
    .slice(0, -2);
  const style_width = +getComputedStyle(canvas)
    .getPropertyValue("width")
    .slice(0, -2);
  canvas.setAttribute("height", (style_height * dpi).toString());
  canvas.setAttribute("width", (style_width * dpi).toString());
  ctx = canvas.getContext("2d", {
    alpha: false,
  }) as CanvasRenderingContext2D;

  view = {
    width: canvas.width,
    height: canvas.height,
    offset: canvas.height * 0.018,
    borderLines: canvas.height * 0.024,
  };
}

function initGame() {
  paddleOne = {
    height: view.height * 0.24,
    width: view.width * 0.02,
    y: (view.height - view.height * 0.24) / 2,
    offset: view.width * 0.0026,
  };
  paddleTwo = {
    height: view.height * 0.24,
    width: view.width * 0.02,
    y: (view.height - view.height * 0.24) / 2,
    offset: view.width * 0.0026,
  };
  if (props.player == "1") {
    playerOne = {
      id: props.id,
      score: 0,
      paddle: paddleOne,
    };
  }
  if (props.player == "2") {
    playerTwo = {
      id: props.id,
      score: 0,
      paddle: paddleTwo,
    };
  }
  ball = {
    radius: view.width * 0.014,
    x: view.width / 8,
    y: view.height / 2,
    moveX: (view.width * 0.014) / 5,
    moveY: -((view.width * 0.014) / 5),
  };
  key = { up: false, down: false };
}

/************
 * END GAME *
 ************/

// async function endGame(winner: Player) {
//   winner.score++;
//   if (winner.score === 3) {
//     clearInterval(intervalId);
//     ctx.clearRect(0, 0, view.width, view.height);
//     drawCenterLine();
//     drawBorderLines();
//     drawScoreboard();
//     drawBall();
//     drawPaddles();
//     drawGameOver(winner);
//     await sleep(2000);
//     updateInPlay();
//     return;
//   }
//   clearInterval(intervalId);
//   initGame();
//   await countdown().then((data) => {
//     console.log(data);
//   });
//   intervalId = setInterval(draw, 1);
// }

/*********************
 * DRAWING FUNCTIONS *
 *********************/

async function draw() {
  ctx.clearRect(0, 0, view.width, view.height);
  drawCenterLine();
  drawBorderLines();
  determineKeyStrokes();
  drawPaddles();
  drawBall();
  moveBall();
}

function drawScoreboard() {
  ctx.beginPath();
  ctx.font = view.width * 0.07 + "px ArcadeClassic";
  ctx.fillStyle = "#39ff14";
  ctx.fillText(
    playerOne.score.toString(),
    view.width / 2 - view.width / 16,
    view.height / 6
  );
  ctx.fillText(
    playerTwo.score.toString(),
    view.width / 2 + view.width / 16,
    view.height / 6
  );
  ctx.closePath();
}

function drawBorderLines() {
  ctx.beginPath();
  ctx.setLineDash([0]);
  ctx.lineWidth = view.borderLines;
  ctx.moveTo(view.width * 0.006, view.height * 0.018);
  ctx.lineTo(view.width - view.width * 0.006, view.height * 0.018);
  ctx.moveTo(view.width * 0.006, view.height - view.height * 0.018);
  ctx.lineTo(
    view.width - view.width * 0.006,
    view.height - view.height * 0.018
  );
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.closePath();
}

function drawCenterLine() {
  ctx.beginPath();
  ctx.lineWidth = view.width * 0.015;
  ctx.setLineDash([view.width * 0.014, 27]);
  ctx.moveTo(view.width / 2, view.height * 0.05);
  ctx.lineTo(view.width / 2, view.height - view.height * 0.05);
  ctx.strokeStyle = "#FFFFFF";
  ctx.stroke();
  ctx.closePath();
}

function drawPaddles() {
  ctx.beginPath();
  ctx.rect(
    paddleOne.width + paddleOne.offset,
    paddleOne.y,
    paddleOne.width,
    paddleOne.height
  );
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.rect(
    view.width - (paddleTwo.width * 2 + paddleTwo.offset),
    paddleTwo.y,
    paddleTwo.width,
    paddleTwo.height
  );
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.rect(ball.x, ball.y, ball.radius, ball.radius);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.closePath();
}

function drawGameOver(winner: Player) {
  ctx.beginPath();
  ctx.font = view.width * 0.07 + "px ArcadeClassic";
  ctx.textAlign = "center";
  ctx.fillText(
    "PLAYER " + winner.id,
    view.width / 2 - view.width / 6,
    view.height - view.height / 3
  );
  ctx.fillText(
    "WINS",
    view.width / 2 + view.width / 8,
    view.height - view.height / 3
  );

  ctx.font = view.width * 0.07 + "px ArcadeClassic";
  ctx.textAlign = "center";
  ctx.fillText("GAME", view.width / 2 - view.width / 8, view.height / 3);
  ctx.fillText("OVER", view.width / 2 + view.width / 8, view.height / 3);
  ctx.closePath();
}

/************
 * MOVEMENT *
 ************/

async function determineKeyStrokes() {
  const gameRoom: GameRoom = {
    room: props.gameid,
    player: props.player,
    paddleOne: paddleOne,
    paddleTwo: paddleTwo,
    ball: ball,
    view: view,
  };
  if (key.up) {
    props.socket.emit("movePaddleUp", gameRoom);
  }
  if (key.down) {
    props.socket.emit("movePaddleDown", gameRoom);
  }
}

props.socket.on("movePaddleUp", (player: string) => {
  if (player == "1") {
    paddleOne.y = Math.max(
      paddleOne.y - view.height * 0.01,
      view.offset + view.borderLines
    );
  } else {
    paddleTwo.y = Math.max(
      paddleTwo.y - view.height * 0.01,
      view.offset + view.borderLines
    );
  }
});

props.socket.on("movePaddleDown", (player: string) => {
  if (player == "1") {
    paddleOne.y = Math.min(
      paddleOne.y + view.height * 0.01,
      view.height - paddleOne.height - view.offset - view.borderLines
    );
  } else {
    paddleTwo.y = Math.min(
      paddleTwo.y + view.height * 0.01,
      view.height - paddleTwo.height - view.offset - view.borderLines
    );
  }
});

function moveBall() {
  props.socket.emit("moveBall", props.gameid);
}

props.socket.on("calculateBallMovement", () => {
  if (
    ball.x + ball.moveX >
    view.width - ball.radius - paddleTwo.width * 2 - paddleTwo.offset
  ) {
    if (
      ball.y > paddleTwo.y - ball.radius &&
      ball.y < paddleTwo.y + paddleTwo.height + ball.radius
    ) {
      console.log("RIGHT PADDLE HIT");
      ball.moveX = -ball.moveX;
    } else {
      console.log("RIGHT PADDLE MISSED - END GAME");
      ball.moveX = -ball.moveX;
      // endGame(player1); // figure out how to handle this (likely emit it)
    }
  } else if (
    ball.x + ball.moveX <
    ball.radius + paddleTwo.width + paddleTwo.offset
  ) {
    if (
      ball.y > paddleOne.y - ball.radius &&
      ball.y < paddleOne.y + paddleOne.height + ball.radius
    ) {
      ball.moveX = -ball.moveX;
      console.log("LEFT PADDLE HIT");
    } else {
      ball.moveX = -ball.moveX;
      // endGame(player2); // figure out how to handle this (likely emit it)
    }
  }
  if (ball.y + ball.moveY < ball.radius + view.offset - view.borderLines) {
    ball.moveY = -ball.moveY;
    console.log("TOP WALL HIT");
  } else if (ball.y + ball.moveY > view.height - ball.radius - view.offset) {
    ball.moveY = -ball.moveY;
    console.log("BOTTOM WALL HIT");
  }
  ball.x += ball.moveX;
  ball.y += ball.moveY;
});

/****************
 * KEY HANDLERS *
 ****************/

function keyDownHandler(e: KeyboardEvent) {
  if (e.key === "Up" || e.key === "ArrowUp") {
    key.up = true;
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    key.down = true;
  }
}

function keyUpHandler(e: KeyboardEvent) {
  if (e.key === "Up" || e.key === "ArrowUp") {
    key.up = false;
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    key.down = false;
  }
}
</script>

<style scoped>
canvas {
  height: 80%;
  width: 100%;
  color: white;
  display: block;
}
</style>
