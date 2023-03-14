<template>
  <div class="pong-div">
    <button v-if="inGame" @click="colorMode">COLOR MODE</button>
    <button v-else @click="goBack">GO BACK</button>
    <canvas id="canvas" ref="game"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import type { PropType } from "vue";
import {
  type Keys,
  type GameRoom,
  type Canvas,
  type Colors,
  UserStatus,
} from "./pong.types";
import { Socket } from "socket.io-client";
import { updateUserStatus } from "@/utils/userStatus";
import apiRequest from "../../utils/apiRequest";

const props = defineProps({
  id: { type: Number, required: true },
  game: { type: Object as PropType<GameRoom>, required: true },
  socket: { type: Socket, required: true },
});

let view: Canvas;
let ctx: CanvasRenderingContext2D;
let key: Keys;
let gameRoom: GameRoom;
let color: Colors;
const inGame = ref(true);

onMounted(async () => {
  console.log("onMounted");
  initCanvas();
  initGame();
  drawBorderLines();
  drawCenterLine();
  drawPaddles();
  await updateUserStatus(props.id, UserStatus.GAME);
  if (gameRoom.player == 1) {
    props.socket.emit("countdown", gameRoom);
  }
});

onUnmounted(async () => {
  console.log("PongGame unmounted");
  await updateUserStatus(props.id, UserStatus.ONLINE);
  // if (gameRoom.player == 0) {
  //   props.socket.emit("leaveRoom", gameRoom.id);
  // }
});

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
    offset: canvas.height * 0.02,
    borderLines: canvas.height * 0.024,
  };
  color = {
    paddle: "#FFFFFF",
    borderLines: "#FFFFFF",
    centerLine: "#FFFFFF",
    canvas: "#000000",
    ball: "FFFFFF",
    scoreBoard: "#39ff14",
    countDown: "#39ff14",
  };
}

function initGame() {
  gameRoom = {
    id: props.game.id,
    player: props.game.player,
    winner: props.game.winner,
    loser: props.game.loser,
    playerOne: {
      id: props.game.playerOne.id,
      socket: props.game.playerOne.socket,
      score: 0,
      paddle: {
        height: view.height * 0.24,
        width: view.width * 0.02,
        y: (view.height - view.height * 0.24) / 2,
        offset: view.width * 0.0026,
      },
      disconnected: false,
    },
    playerTwo: {
      id: props.game.playerTwo.id,
      socket: props.game.playerTwo.socket,
      score: 0,
      paddle: {
        height: view.height * 0.24,
        width: view.width * 0.02,
        y: (view.height - view.height * 0.24) / 2,
        offset: view.width * 0.0026,
      },
      disconnected: false,
    },
    ball: {
      radius: view.width * 0.014,
      x: view.width / 2,
      y: view.height / 2,
      moveX: (view.width * 0.014) / 5,
      moveY: -((view.width * 0.014) / 5),
    },
    view: view,
    state: props.game.state,
  };
  key = { up: false, down: false };
  if (gameRoom.player != 0) {
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
  }
}

/************
 * END GAME *
 ************/

// const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
// const emit = defineEmits(["game-over"]);

props.socket.on(
  "drawScoreboard",
  (playerOneScore: number, playerTwoScore: number, winner: number) => {
    drawScoreboard(playerOneScore, playerTwoScore);
    drawGameOver(winner);
    gameOver();
  }
);

function goBack() {
  window.location.href = "/game";
}

async function gameOver() {
  inGame.value = false;
  if (gameRoom.player !== 0) {
    await apiRequest(`/game`, "put", { data: gameRoom }).catch((err) => {
      console.log("Something went wrong with updating with game result: ", err);
    });
  }
  props.socket.emit("leaveRoom", String(gameRoom.id));
  // await sleep(2000);
  // emit("game-over", gameRoom);
}

props.socket.on("endGame", (winner: number) => {
  console.log("PongGame.endGame");
  ctx.fillStyle = color.canvas;
  ctx.fillRect(0, 0, gameRoom.view.width, gameRoom.view.height);
  drawCenterLine();
  drawBorderLines();
  drawPaddles();
  drawScoreboard(gameRoom.playerOne.score, gameRoom.playerTwo.score);
  drawGameOver(winner);
  gameOver();
});

/********************
 * UPDATE GAME ROOM *
 *******************/

props.socket.on(
  "updateScore",
  (playerOneScore: number, playerTwoScore: number) => {
    gameRoom.playerOne.score = playerOneScore;
    gameRoom.playerTwo.score = playerTwoScore;
  }
);

/************
 * MOVEMENT *
 ************/

async function determineKeyStrokes() {
  if (key.up) {
    props.socket.emit("movePaddleUp", gameRoom);
  }
  if (key.down) {
    props.socket.emit("movePaddleDown", gameRoom);
  }
}

props.socket.on("movePaddleOneUp", (MoveY: number) => {
  gameRoom.playerOne.paddle.y = MoveY * gameRoom.view.height;
});

props.socket.on("movePaddleTwoUp", (MoveY: number) => {
  gameRoom.playerTwo.paddle.y = MoveY * gameRoom.view.height;
});

props.socket.on("movePaddleOneDown", (MoveY: number) => {
  gameRoom.playerOne.paddle.y = MoveY * gameRoom.view.height;
});

props.socket.on("movePaddleTwoDown", (MoveY: number) => {
  gameRoom.playerTwo.paddle.y = MoveY * gameRoom.view.height;
});

props.socket.on("resetBall", (ballMoveX: number) => {
  let ballX: number;

  if (ballMoveX < 0) {
    ballX = gameRoom.view.width - gameRoom.view.width / 4;
  } else {
    ballX = gameRoom.view.width / 4;
  }
  gameRoom.ball = {
    radius: gameRoom.view.width * 0.014,
    x: ballX,
    y: gameRoom.view.height / 2,
    moveX: (gameRoom.view.width * 0.014) / 5,
    moveY: -((gameRoom.view.width * 0.014) / 5),
  };
  if (ballMoveX < 0) gameRoom.ball.moveX = -gameRoom.ball.moveX;
  if (gameRoom.player == 1) {
    props.socket.emit("countdown", gameRoom);
  }
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

/**************
 * COLOR MODE *
 *************/

function colorMode() {
  color.canvas = "pink";
  color.borderLines = "white";
  color.centerLine = "white";
  color.paddle = "yellow";
  color.ball = "white";
  color.scoreBoard = "aqua";
  color.countDown = "aqua";
}

/*********************
 * DRAWING FUNCTIONS *
 *********************/

props.socket.on("drawCountdown", (count: number) => {
  ctx.fillStyle = color.canvas;
  ctx.fillRect(0, 0, gameRoom.view.width, gameRoom.view.height);
  drawBorderLines();
  drawCountdownCenterLine();
  drawPaddles();
  drawCountdown(count);
  drawScoreboard(gameRoom.playerOne.score, gameRoom.playerTwo.score);
});

props.socket.on("drawCanvas", () => {
  ctx.fillStyle = color.canvas;
  ctx.fillRect(0, 0, gameRoom.view.width, gameRoom.view.height);
  drawCenterLine();
  drawBorderLines();
  drawScoreboard(gameRoom.playerOne.score, gameRoom.playerTwo.score);
  if (gameRoom.player == 1) props.socket.emit("moveBall", gameRoom);
  drawBall();
  determineKeyStrokes();
  drawPaddles();
  drawBall();
});

async function drawScoreboard(playerOneScore: number, playerTwoScore: number) {
  ctx.beginPath();
  ctx.font = gameRoom.view.width * 0.07 + "px ArcadeClassic";
  ctx.fillStyle = color.scoreBoard;
  ctx.fillText(
    playerOneScore.toString(),
    gameRoom.view.width / 2 - gameRoom.view.width / 16,
    gameRoom.view.height / 6
  );
  ctx.fillText(
    playerTwoScore.toString(),
    gameRoom.view.width / 2 + gameRoom.view.width / 16,
    gameRoom.view.height / 6
  );
  ctx.closePath();
}

async function drawCenterLine() {
  ctx.beginPath();
  ctx.lineWidth = gameRoom.view.width * 0.015;
  ctx.setLineDash([gameRoom.view.width * 0.014, 27]);
  ctx.moveTo(gameRoom.view.width / 2, gameRoom.view.height * 0.05);
  ctx.lineTo(
    gameRoom.view.width / 2,
    gameRoom.view.height - gameRoom.view.height * 0.05
  );
  ctx.strokeStyle = color.centerLine;
  ctx.stroke();
  ctx.closePath();
}

async function drawBorderLines() {
  ctx.beginPath();
  ctx.setLineDash([0]);
  ctx.lineWidth = gameRoom.view.borderLines;
  ctx.moveTo(gameRoom.view.width * 0.006, gameRoom.view.offset);
  ctx.lineTo(
    gameRoom.view.width - gameRoom.view.width * 0.006,
    gameRoom.view.offset
  );
  ctx.moveTo(
    gameRoom.view.width * 0.006,
    gameRoom.view.height - gameRoom.view.offset
  );
  ctx.lineTo(
    gameRoom.view.width - gameRoom.view.width * 0.006,
    gameRoom.view.height - gameRoom.view.offset
  );
  ctx.strokeStyle = color.borderLines;
  ctx.stroke();
  ctx.closePath();
}

function drawPaddles() {
  ctx.beginPath();
  ctx.rect(
    gameRoom.playerOne.paddle.width + gameRoom.playerOne.paddle.offset,
    gameRoom.playerOne.paddle.y,
    gameRoom.playerOne.paddle.width,
    gameRoom.playerOne.paddle.height
  );
  ctx.fillStyle = color.paddle;
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.rect(
    gameRoom.view.width -
      (gameRoom.playerTwo.paddle.width * 2 + gameRoom.playerTwo.paddle.offset),
    gameRoom.playerTwo.paddle.y,
    gameRoom.playerTwo.paddle.width,
    gameRoom.playerTwo.paddle.height
  );
  ctx.fillStyle = color.paddle;
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.rect(
    gameRoom.ball.x,
    gameRoom.ball.y,
    gameRoom.ball.radius,
    gameRoom.ball.radius
  );
  ctx.fillStyle = color.ball;
  ctx.fill();
  ctx.closePath();
}

props.socket.on(
  "drawBall",
  (x: number, y: number, moveX: number, moveY: number) => {
    gameRoom.ball.x = x * gameRoom.view.width;
    gameRoom.ball.y = y * gameRoom.view.height;
    gameRoom.ball.moveX = moveX * gameRoom.view.width;
    gameRoom.ball.moveY = moveY * gameRoom.view.height;

    ctx.beginPath();
    ctx.rect(
      gameRoom.ball.x,
      gameRoom.ball.y,
      gameRoom.ball.radius,
      gameRoom.ball.radius
    );
    ctx.fillStyle = color.ball;
    ctx.fill();
    ctx.closePath();
  }
);

const drawCountdown = (count: number) => {
  ctx.beginPath();
  ctx.fillStyle = color.countDown;
  ctx.font = gameRoom.view.width * 0.1 + "px ArcadeClassic";
  ctx.textAlign = "center";
  if (count == 0) {
    ctx.fillText(
      "GO!",
      gameRoom.view.width / 2,
      gameRoom.view.height / 2 + gameRoom.view.height * 0.04
    );
  } else {
    ctx.fillText(
      count.toString(),
      gameRoom.view.width / 2,
      gameRoom.view.height / 2 + gameRoom.view.height * 0.04
    );
  }
  ctx.stroke();
  ctx.closePath();
};

function drawCountdownCenterLine() {
  ctx.beginPath();
  ctx.lineWidth = gameRoom.view.width * 0.015;
  ctx.setLineDash([gameRoom.view.width * 0.014, 27]);
  ctx.moveTo(gameRoom.view.width / 2, gameRoom.view.height * 0.05);
  ctx.lineTo(
    gameRoom.view.width / 2,
    gameRoom.view.height / 2 - gameRoom.view.height * 0.13
  );
  ctx.strokeStyle = color.centerLine;
  ctx.stroke();
  ctx.moveTo(
    gameRoom.view.width / 2,
    gameRoom.view.height / 2 + gameRoom.view.height * 0.09
  );
  ctx.lineTo(
    gameRoom.view.width / 2,
    gameRoom.view.height - gameRoom.view.height * 0.05
  );
  ctx.strokeStyle = color.centerLine;
  ctx.stroke();
  ctx.closePath();
}

function drawGameOver(winner: number) {
  ctx.beginPath();
  ctx.font = gameRoom.view.width * 0.07 + "px ArcadeClassic";
  ctx.textAlign = "center";
  ctx.fillText(
    "PLAYER " + winner,
    gameRoom.view.width / 2 - gameRoom.view.width / 6,
    gameRoom.view.height - gameRoom.view.height / 3
  );
  ctx.fillText(
    "WINS",
    gameRoom.view.width / 2 + gameRoom.view.width / 8,
    gameRoom.view.height - gameRoom.view.height / 3
  );

  ctx.font = gameRoom.view.width * 0.07 + "px ArcadeClassic";
  ctx.textAlign = "center";
  ctx.fillText(
    "GAME",
    gameRoom.view.width / 2 - gameRoom.view.width / 8,
    gameRoom.view.height / 3
  );
  ctx.fillText(
    "OVER",
    gameRoom.view.width / 2 + gameRoom.view.width / 8,
    gameRoom.view.height / 3
  );
  ctx.closePath();
}
</script>

<style scoped>
button {
  margin-bottom: 15px;
  width: 33%;
}
canvas {
  width: 100%;
  color: white;
  display: block;
}

.pong-div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
