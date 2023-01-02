<template>
  <canvas id="myCanvas" ref="game"> </canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Keys, Paddle, Canvas, Ball } from "./PongTypes";

let paddle1: Paddle;
let paddle2: Paddle;
let view: Canvas;
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let ball: Ball;
let key: Keys;
let player1Score: number;
let player2Score: number;
const borderLines = 17;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

const emit = defineEmits(["game-over"]);

function updateInPlay() {
  emit("game-over", false);
}

function initCanvas() {
  // storing a reference to the <canvas> element to the canvas variable.
  canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
  /* below 9 lines get rid of the blurriness of canvas due to dpi*/
  const dpi = window.devicePixelRatio;
  const style_height = +getComputedStyle(canvas)
    .getPropertyValue("height")
    .slice(0, -2);
  const style_width = +getComputedStyle(canvas)
    .getPropertyValue("width")
    .slice(0, -2);
  canvas.setAttribute("height", (style_height * dpi).toString());
  canvas.setAttribute("width", (style_width * dpi).toString());

  // ctx variable to store the 2D rendering context — the actual tool we can use to paint on the Canvas.
  ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.imageSmoothingEnabled = false;
  view = {
    width: canvas.width,
    height: canvas.height,
    offset: canvas.height * 0.018,
  };
}

function initGame() {
  ball = {
    radius: view.width * 0.014,
    x: view.width / 8,
    y: view.height / 2,
    moveX: 2,
    moveY: -2,
  };
  paddle1 = {
    height: view.height * 0.24,
    width: view.width * 0.02,
    y: (view.height - view.height * 0.24) / 2,
    offset: view.width * 0.0026,
  };
  paddle2 = {
    height: view.height * 0.24,
    width: view.width * 0.02,
    y: (view.height - view.height * 0.24) / 2,
    offset: view.width * 0.0026,
  };
  key = { up: false, down: false, w: false, s: false };
}


onMounted(async () => {
  initCanvas();
  initGame();
  drawBorderLines();
  drawPaddleOne();
  drawPaddleTwo();
  drawCenterLine();
  await countdown().then((data) => {
    console.log(data);
  });
  intervalId = setInterval(draw, 1);
});

let intervalId = setInterval(draw, 1); // change interval to change speed; can be a feature?
clearInterval(intervalId);

const drawCountdown = (count: number) => {
  ctx.beginPath();
  ctx.font = view.width * 0.1 + "px ArcadeClassic";
  ctx.textAlign = "center";
  if (count == 0) {
    ctx.fillText("GO!", view.width / 2, view.height / 2);
  } else {
    ctx.fillText(count.toString(), view.width / 2, view.height / 2);
  }
  ctx.closePath();
};

const countdown = () => {
  return new Promise((resolve) => {
    let count = 3;

    const timeout = setInterval(function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBorderLines();
      drawPaddleOne();
      drawPaddleTwo();
      if (count < 0) {
        clearInterval(timeout);
        resolve("start game!");
      }
      drawCountdown(count);
      count--;
    }, 750);
  });
};

async function endGame() {
  clearInterval(intervalId);
  initGame();
  await countdown().then((data) => {
    console.log(data);
  });
  intervalId = setInterval(draw, 1);
  // drawGameOver();
  // await sleep(1000);
  // updateInPlay();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCenterLine();
  drawBorderLines();
  drawBall();
  drawPaddleOne();
  drawPaddleTwo();
  calculateMoves();
  determineKeystrokes();
}

function drawGameOver() {
  // ctx.font = view.width * 0.07 + "px myPong";
  // ctx.textAlign = "center";
  // ctx.fillText("PLAYER  1 WINS", view.width / 2, view.height - view.height / 3);

  ctx.font = view.width * 0.07 + "px ArcadeClassic";
  ctx.textAlign = "center";
  ctx.fillText("GAME  OVER", view.width / 2, view.height / 3);
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

function drawBorderLines() {
  ctx.beginPath();
  ctx.setLineDash([0]);
  ctx.lineWidth = borderLines;
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

function drawBall() {
  ctx.beginPath();
  ctx.rect(ball.x, ball.y, ball.radius, ball.radius);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.closePath();
}

function drawPaddleOne() {
  ctx.beginPath();
  ctx.rect(
    paddle1.width + paddle1.offset,
    paddle1.y,
    paddle1.width,
    paddle1.height
  );
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.closePath();
}

function drawPaddleTwo() {
  ctx.beginPath();
  ctx.rect(
    view.width - (paddle2.width * 2 + paddle2.offset),
    paddle2.y,
    paddle2.width,
    paddle2.height
  );
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.closePath();
}

function calculateMoves() {
  if (
    ball.x + ball.moveX >
    canvas.width - ball.radius - paddle2.width * 2 - paddle2.offset
  ) {
    if (
      ball.y > paddle2.y - ball.radius &&
      ball.y < paddle2.y + paddle2.height + ball.radius
    ) {
      ball.moveX = -ball.moveX;
      console.log("RIGHT PADDLE HIT");
    } else {
      ball.moveX = -ball.moveX;
      endGame();
    }
  } else if (
    ball.x + ball.moveX <
    ball.radius + paddle2.width + paddle2.offset
  ) {
    if (
      ball.y > paddle1.y - ball.radius &&
      ball.y < paddle1.y + paddle1.height + ball.radius
    ) {
      ball.moveX = -ball.moveX;
      console.log("LEFT PADDLE HIT");
    } else {
      ball.moveX = -ball.moveX;
      endGame();
    }
  }
  if (ball.y + ball.moveY < ball.radius + view.offset - borderLines) {
    ball.moveY = -ball.moveY;
    console.log("TOP WALL HIT");
  } else if (ball.y + ball.moveY > canvas.height - ball.radius - view.offset) {
    ball.moveY = -ball.moveY;
    console.log("BOTTOM WALL HIT");
  }
  ball.x += ball.moveX;
  ball.y += ball.moveY;
}

function determineKeystrokes() {
  if (key.up) {
    paddle1.y = Math.max(paddle1.y - 7, view.offset + borderLines);
  } else if (key.down) {
    paddle1.y = Math.min(
      paddle1.y + 7,
      canvas.height - paddle1.height - view.offset - borderLines
    );
  }
  if (key.s) {
    paddle2.y = Math.min(
      paddle2.y + 7,
      canvas.height - paddle2.height - view.offset - borderLines
    );
  } else if (key.w) {
    paddle2.y = Math.max(paddle2.y - 7, view.offset + borderLines);
  }
}

function keyDownHandler(e: KeyboardEvent) {
  console.log(e);
  if (e.key === "Up" || e.key === "ArrowUp") {
    key.up = true;
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    key.down = true;
  }
  if (e.key === "w") {
    key.w = true;
  } else if (e.key === "s") {
    key.s = true;
  }
}

function keyUpHandler(e: KeyboardEvent) {
  console.log(e);
  if (e.key === "Up" || e.key === "ArrowUp") {
    key.up = false;
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    key.down = false;
  }
  if (e.key === "w") {
    key.w = false;
  } else if (e.key === "s") {
    key.s = false;
  }
}
</script>

<style scoped>
canvas {
  height: 50%;
  width: 100%;
  /* background: #1c1b1b; */
  display: block;
  /* margin: auto auto; */
  /* width: 100%; */
  /* object-fit: cover; */
  border: 1px rgb(111, 109, 109) solid;
}
</style>

<!-- for multicolor ball mode
// ctx.fillStyle = generateRandomColor(); // mess with this for multicolor mode

function generateRandomColor() {
  const maxVal = 0xffffff; // 16777215
  let randomNumber: any = Math.random() * maxVal;
  randomNumber = Math.floor(randomNumber);
  randomNumber = randomNumber.toString(16);
  const randColor = randomNumber.padStart(6, 0);
  return `#${randColor.toUpperCase()}`;
} -->
