<template>
  <div id="display-content">
    <canvas id="canvas" ref="game"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import type { Ball, Canvas, Keys, Paddle, Player } from "./pong.types";
import { Socket } from "socket.io-client";

const props = defineProps({
  id: { type: String, required: true },
  gameid: { type: Number, required: true },
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
});

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
  props.socket.emit("ballPosition", ball);
}

/*********************
 * DRAWING FUNCTIONS *
 *********************/

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

/****************
 * KEY HANDLERS *
 ****************/

function keyDownHandler(e: KeyboardEvent) {
  console.log(e);
  if (e.key === "Up" || e.key === "ArrowUp") {
    key.up = true;
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    key.down = true;
  }
}

function keyUpHandler(e: KeyboardEvent) {
  console.log(e);
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
