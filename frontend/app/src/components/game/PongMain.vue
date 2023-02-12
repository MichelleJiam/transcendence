<template>
  <div id="display-content">
    <canvas id="canvas" ref="game"> </canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import type { Canvas, Paddle } from "./pong.types";

let view: Canvas;
let ctx: CanvasRenderingContext2D;
let paddleOne: Paddle;
let paddleTwo: Paddle;

onMounted(async () => {
  initCanvas();
  drawBorderLines();
  drawCenterLine();
  drawPaddles();
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
</script>

<style scoped>
canvas {
  height: 80%;
  width: 100%;
  color: white;
  display: block;
}
</style>
