<template>
  <canvas id="myCanvas" ref="game"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

let ctx: CanvasRenderingContext2D;
let canvas: HTMLCanvasElement;
let canvasWidth: number;
let canvasHeight: number;
let x: number;
let y: number;
let dx = 2;
let dy = -2;
const ballRadius = 6;
let hit = false;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleOne: number;
let paddleTwo: number;
let rightPressed = false;
let leftPressed = false;
let aPressed = false;
let dPressed = false;
const paddleOffset = 4;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

onMounted(() => {
  // storing a reference to the <canvas> element to the canvas variable.
  canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
  const heightRatio = 1;
  canvas.height = canvas.width * heightRatio;
  // ctx variable to store the 2D rendering context — the actual tool we can use to paint on the Canvas.
  ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  x = canvas.width / 2;
  y = canvas.height - 30;
  paddleOne = (canvas.width - paddleWidth) / 2; // where x of paddle starts
  paddleTwo = (canvas.width - paddleWidth) / 2;
});

function drawCenterLine() {
  ctx.beginPath();
  ctx.setLineDash([10, 10]);
  ctx.moveTo(canvasWidth * 0.03, canvasHeight / 2);
  ctx.lineTo(canvasWidth - canvasWidth * 0.03, canvasHeight / 2);
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineCap = "round";
  ctx.stroke();
}
// for multicolor ball mode
function generateRandomColor() {
  const maxVal = 0xffffff; // 16777215
  let randomNumber: any = Math.random() * maxVal;
  randomNumber = Math.floor(randomNumber);
  randomNumber = randomNumber.toString(16);
  const randColor = randomNumber.padStart(6, 0);
  return `#${randColor.toUpperCase()}`;
}
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  // ctx.fillStyle = generateRandomColor(); // mess with this for multicolor mode
  ctx.fill();
  ctx.closePath();
  hit = false;
}

function drawPaddleOne() {
  ctx.beginPath();
  ctx.rect(
    paddleOne,
    canvas.height - paddleHeight - paddleOffset,
    paddleWidth,
    paddleHeight
  );
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.closePath();
}

function drawPaddleTwo() {
  ctx.beginPath();
  ctx.rect(paddleTwo, paddleOffset, paddleWidth, paddleHeight);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.closePath();
}

function draw(bar: Paddles) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCenterLine();
  drawBall();
  drawPaddleOne();
  drawPaddleTwo();

  if (x + dx > canvas.width - ballRadius) {
    dx = -dx;
    console.log("RIGHT WALL HIT");
  } else if (x + dx < ballRadius) {
    dx = -dx;
    console.log("LEFT WALL HIT");
  }
  if (y + dy - paddleOffset < ballRadius + paddleOffset) {
    if (
      x > paddleTwo - ballRadius &&
      x < paddleTwo + paddleWidth + ballRadius
    ) {
      dy = -dy;
      console.log("PADDLE HIT TOP");
    } else {
      console.log("GAME OVER");
      alert("GAME OVER");
      document.location.reload();
      clearInterval(interval);
    }
  } else if (
    y + dy + paddleOffset >
    canvas.height - ballRadius - paddleOffset
  ) {
    // this affects the ball bouncing on the bottom
    if (
      x > paddleOne - ballRadius &&
      x < paddleOne + paddleWidth + ballRadius
    ) {
      dy = -dy;
      console.log("PADDLE HIT BOTTOM");
      hit = true;
    } else {
      console.log("GAME OVER");
      alert("GAME OVER");
      document.location.reload();
      clearInterval(interval);
    }
  }
  if (rightPressed) {
    paddleOne = Math.min(paddleOne + 7, canvas.width - paddleWidth);
  } else if (leftPressed) {
    paddleOne = Math.max(paddleOne - 7, 0);
  }
  if (dPressed) {
    paddleTwo = Math.min(paddleTwo + 7, canvas.width - paddleWidth);
  } else if (aPressed) {
    paddleTwo = Math.max(paddleTwo - 7, 0);
  }

  x += dx;
  y += dy;
}

function keyDownHandler(e: any) {
  console.log(e);
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
  if (e.key === "a") {
    aPressed = true;
  } else if (e.key === "d") {
    dPressed = true;
  }
}

function keyUpHandler(e: any) {
  console.log(e);
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
  if (e.key === "a") {
    aPressed = false;
  } else if (e.key === "d") {
    dPressed = false;
  }
}

const interval = setInterval(draw, 10); // change interval to change speed; can be a feature?
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
canvas {
  background: black;
  border-width: 2px;
  display: block;
  margin: 0 auto;
  width: 80%;
  object-fit: contain;
}
</style>
