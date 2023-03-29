<template>
  <div class="pong-div">
    <div class="playernames">
      <h3 class="playerone">{{ props.game.playerOne.name }}</h3>
      <h3 class="playertwo">{{ props.game.playerTwo.name }}</h3>
    </div>
    <button v-if="inGame" @click="colorMode">COLOR MODE</button>
    <button v-else @click="goBack">GO BACK</button>
    <canvas id="canvas" ref="game"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import type { PropType } from "vue";
import {
  type GameRoom,
  type Canvas,
  type Colors,
  UserStatus,
} from "./pong.types";
import { Socket } from "socket.io-client";
import { updateUserStatus } from "@/utils/userStatus";
import apiRequest from "../../utils/apiRequest";
import router from "@/router";

const props = defineProps({
  id: { type: Number, required: true },
  game: { type: Object as PropType<GameRoom>, required: true },
  socket: { type: Socket, required: true },
});

let view: Canvas;
let ctx: CanvasRenderingContext2D;
let gameRoom: GameRoom;
let color: Colors;
const colorModeOn = ref(false);
const inGame = ref(true);
let reqId: number;

onMounted(async () => {
  initCanvas();
  initGame();
  drawBorderLines();
  drawCenterLine();
  drawPaddles();
  await updateUserStatus(props.id, UserStatus.GAME);
  if (gameRoom.player === 1) {
    props.socket.emit("createNewGame", gameRoom);
  }
  if (gameRoom.player === 0) {
    gameLoop();
  }
});

// Triggered on navigate away
onUnmounted(async () => {
  // If a watcher or player navigates away during an active game
  if (inGame.value === true) {
    props.socket.emit("activeGameLeft", gameRoom);
  }
  await updateUserStatus(props.id, UserStatus.ONLINE);
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

async function initGame() {
  gameRoom = {
    id: props.game.id,
    player: props.game.player,
    winner: props.game.winner,
    loser: props.game.loser,
    playerOne: {
      id: props.game.playerOne.id,
      name: props.game.playerOne.name,
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
      name: props.game.playerTwo.name,
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
  if (gameRoom.player != 0) {
    document.addEventListener("keydown", keyPressHandler, false);
    document.addEventListener("keyup", keyPressHandler, false);
  }
}

/************
 * GAME LOOP *
 ************/

function drawGame() {
  ctx.fillStyle = color.canvas;
  ctx.fillRect(0, 0, gameRoom.view.width, gameRoom.view.height);
  drawCenterLine();
  drawBorderLines();
  drawScoreboard();
  drawPaddles();
  drawBall();
}

function gameLoop() {
  drawGame();
  reqId = requestAnimationFrame(gameLoop);
}

/************
 * END GAME *
 ************/

function goBack() {
  router.push("/leaderboard");
}

async function gameOver() {
  inGame.value = false;
  if (gameRoom.player !== 0) {
    await apiRequest(`/game`, "put", { data: gameRoom }).catch((err) => {
      if (err.response.status === 401) {
        console.debug("Couldn't update game because user is logged out");
        return;
      }
      console.log("Something went wrong with updating with game result: ", err);
    });
  }
  props.socket.emit("leaveRoom", String(gameRoom.id));
}

props.socket.on("stopGameLoop", () => {
  window.cancelAnimationFrame(reqId);
});

props.socket.on("endGame", (winnerName: string) => {
  window.cancelAnimationFrame(reqId);
  ctx.fillStyle = color.canvas;
  ctx.fillRect(0, 0, gameRoom.view.width, gameRoom.view.height);
  drawCenterLine();
  drawBorderLines();
  drawPaddles();
  drawScoreboard();
  drawGameOver(winnerName);
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

props.socket.on("updateGameRoom", (updatedGameRoom: GameRoom) => {
  // Update paddle positions
  gameRoom.playerOne.paddle.y =
    gameRoom.view.height *
    (updatedGameRoom.playerOne.paddle.y / updatedGameRoom.view.height);
  gameRoom.playerTwo.paddle.y =
    gameRoom.view.height *
    (updatedGameRoom.playerTwo.paddle.y / updatedGameRoom.view.height);

  // Update ball position
  gameRoom.ball.x =
    gameRoom.view.width * (updatedGameRoom.ball.x / updatedGameRoom.view.width);
  gameRoom.ball.y =
    gameRoom.view.height *
    (updatedGameRoom.ball.y / updatedGameRoom.view.height);
  gameRoom.ball.moveX =
    gameRoom.view.width *
    (updatedGameRoom.ball.moveX / updatedGameRoom.view.width);
  gameRoom.ball.moveY =
    gameRoom.view.height *
    (updatedGameRoom.ball.moveY / updatedGameRoom.view.height);

  // update scores and winner
  gameRoom.winner = updatedGameRoom.winner;
  gameRoom.playerOne.score = updatedGameRoom.playerOne.score;
  gameRoom.playerTwo.score = updatedGameRoom.playerTwo.score;
});

/****************
 * KEY HANDLERS *
 ****************/

function keyPressHandler(e: KeyboardEvent) {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    const input = {
      id: gameRoom.id,
      player: gameRoom.player,
      direction: e.key === "ArrowUp" ? "up" : "down",
    };
    props.socket.emit("playerInput", input);
  }
}

/**************
 * COLOR MODE *
 *************/

function colorMode() {
  if (colorModeOn.value === false) {
    color.canvas = "pink";
    color.borderLines = "white";
    color.centerLine = "white";
    color.paddle = "yellow";
    color.ball = "white";
    color.scoreBoard = "aqua";
    color.countDown = "aqua";
    colorModeOn.value = true;
  } else {
    color.canvas = "#000000";
    color.paddle = "#FFFFFF";
    color.borderLines = "#FFFFFF";
    color.centerLine = "#FFFFFF";
    color.ball = "FFFFFF";
    color.scoreBoard = "#39ff14";
    color.countDown = "#39ff14";
    colorModeOn.value = false;
  }
}

/*********************
 * DRAWING FUNCTIONS *
 *********************/

props.socket.on("drawCountdown", (count: number) => {
  window.cancelAnimationFrame(reqId);
  ctx.fillStyle = color.canvas;
  ctx.fillRect(0, 0, gameRoom.view.width, gameRoom.view.height);
  drawBorderLines();
  drawCountdownCenterLine();
  drawPaddles();
  drawCountdown(count);
  drawScoreboard();
  if (count === -1) {
    gameLoop();
  }
});

function drawScoreboard() {
  ctx.beginPath();
  ctx.font = gameRoom.view.width * 0.07 + "px ArcadeClassic";
  ctx.fillStyle = color.scoreBoard;
  ctx.fillText(
    gameRoom.playerOne.score.toString(),
    gameRoom.view.width / 2 - gameRoom.view.width / 16,
    gameRoom.view.height / 6
  );
  ctx.fillText(
    gameRoom.playerTwo.score.toString(),
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

function drawGameOver(winnerName: string) {
  ctx.beginPath();
  ctx.font = gameRoom.view.width * 0.07 + "px ArcadeClassic";
  ctx.textAlign = "center";
  ctx.fillText(
    winnerName,
    gameRoom.view.width / 2 - gameRoom.view.width / 5,
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
  z-index: 999;
  margin-bottom: 15px;
  width: 33%;
}
canvas {
  position: relative;
  width: 100%;
  color: white;
  display: block;
}

.playernames {
  position: absolute;
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding-left: 30px;
  padding-right: 30px;
}

.playerone,
.playertwo {
  color: var(--primary-color);
}

.pong-div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
