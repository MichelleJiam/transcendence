<template>
  <div>
    <canvas id="myCanvas" ref="game"> </canvas>
  </div>
</template>

<script setup lang="ts">
import { io } from "socket.io-client";
import { onBeforeMount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type { Keys } from "./PongTypes";

const route = useRoute();
const id = route.params.id;
const socket = io("http://localhost:3000");
const joined = ref(false);
const position = ref({ x: 0, y: 0 });
let ctx: CanvasRenderingContext2D;
let canvas: HTMLCanvasElement;
let key: Keys;

onBeforeMount(() => {
  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected from frontend");
  });
});

onMounted(() => {
  socket.on("connect", () => {
    console.log(socket.id + " connected from frontend"); // x8WIv7-mJelg7on_ALbx
    socket.emit("join", "room1");
  });

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

  ctx = canvas.getContext("2d", {
    alpha: false,
  }) as CanvasRenderingContext2D;

  socket.on("position", (data) => {
    position.value = data;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(position.value.x, position.value.y, 20, 20);
    ctx.closePath();
  });

  key = { up: false, down: false, w: false, s: false };
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
});

function keyDownHandler(e: KeyboardEvent) {
  console.log(e);
  if (e.key === "Up" || e.key === "ArrowUp") {
    move("up");
    key.up = true;
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    move("down");
    key.down = true;
  }
  if (e.key === "Right" || e.key === "ArrowRight") {
    move("right");
    key.w = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    move("left");
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

const move = (direction: string) => {
  socket.emit("move", direction);
};

const joinGame = () => {
  socket.emit("join", { id: id }, () => {
    joined.value = true;
  });
};
</script>

<style scoped>
canvas {
  height: 80%;
  width: 100%;
  display: block;
}
</style>
