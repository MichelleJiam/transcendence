<template>
  <div id="display-content">
    <canvas id="canvas" ref="game"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import type { PropType } from "vue";
import type { Keys, GameRoom, Canvas } from "./pong.types";
import { Socket } from "socket.io-client";

const props = defineProps({
  id: { type: String, required: true },
  game: { type: Object as PropType<GameRoom>, required: true },
  socket: { type: Socket, required: true },
});

let view: Canvas;
let ctx: CanvasRenderingContext2D;
let key: Keys;
let gameRoom: GameRoom;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

onMounted(async () => {
  initCanvas();
  initGame();
  drawBorderLines();
  drawCenterLine();
  drawPaddles();
  await countdown().then((data) => {
    console.log(data);
  });
  intervalId = setInterval(draw, 5);
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
    offset: canvas.height * 0.018,
    borderLines: canvas.height * 0.024,
  };
}

function resetBall() {
  gameRoom.ball = {
    radius: gameRoom.view.width * 0.014,
    x: gameRoom.view.width / 8,
    y: gameRoom.view.height / 2,
    moveX: (gameRoom.view.width * 0.014) / 5,
    moveY: -((gameRoom.view.width * 0.014) / 5),
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
    },
    ball: {
      radius: view.width * 0.014,
      x: view.width / 8,
      y: view.height / 2,
      moveX: (view.width * 0.014) / 5,
      moveY: -((view.width * 0.014) / 5),
    },
    view: view,
    state: props.game.state,
  };
  key = { up: false, down: false };
}

/*************
 * COUNTDOWN *
 *************/

const countdown = () => {
  return new Promise<string>((resolve) => {
    let count = 3;

    const timeout = setInterval(function () {
      ctx.clearRect(0, 0, gameRoom.view.width, gameRoom.view.height);
      drawBorderLines();
      drawCountdownCenterLine();
      drawPaddles();
      if (count < 0) {
        clearInterval(timeout);
        resolve("start game!");
      }
      drawCountdown(count);
      drawScoreboard(gameRoom.playerOne.score, gameRoom.playerTwo.score);
      count--;
    }, 750);
  });
};

/*************
 * GAME LOOP *
 *************/

let intervalId = setInterval(draw, 5); // change interval to change speed; can be a feature?
clearInterval(intervalId);

/************
 * END GAME *
 ************/

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const emit = defineEmits(["game-over"]);

async function gameOver() {
  if (gameRoom.winner == 1) {
    gameRoom.winner = gameRoom.playerOne.id;
    gameRoom.loser = gameRoom.playerTwo.id;
  } else {
    gameRoom.winner = gameRoom.playerTwo.id;
    gameRoom.loser = gameRoom.playerOne.id;
  }
  await sleep(2000);
  emit("game-over", gameRoom);
  // document.location.reload();
}

props.socket.on("endGame", (winnerGameRoom: GameRoom) => {
  clearInterval(intervalId);
  ctx.clearRect(0, 0, gameRoom.view.width, gameRoom.view.height);
  drawCenterLine();
  drawBorderLines();
  drawBall();
  drawPaddles();
  drawScoreboard(
    winnerGameRoom.playerOne.score,
    winnerGameRoom.playerTwo.score
  );
  drawGameOver(winnerGameRoom.winner);
  gameOver();
});

async function endMatch() {
  if (gameRoom.winner == 1) {
    gameRoom.playerOne.score++;
  } else {
    gameRoom.playerTwo.score++;
  }

  if (gameRoom.playerOne.score == 3 || gameRoom.playerTwo.score == 3) {
    props.socket.emit("endGame", gameRoom);
    return;
  }
  clearInterval(intervalId);
  resetBall();
  await countdown().then((data) => {
    console.log(data);
  });
  intervalId = setInterval(draw, 5);
}

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

props.socket.on("movePaddleUp", (player: string) => {
  if (player == "1") {
    gameRoom.playerOne.paddle.y = Math.max(
      gameRoom.playerOne.paddle.y - gameRoom.view.height * 0.01,
      gameRoom.view.offset + gameRoom.view.borderLines
    );
  } else {
    gameRoom.playerTwo.paddle.y = Math.max(
      gameRoom.playerTwo.paddle.y - gameRoom.view.height * 0.01,
      gameRoom.view.offset + gameRoom.view.borderLines
    );
  }
});

props.socket.on("movePaddleDown", (player: string) => {
  if (player == "1") {
    gameRoom.playerOne.paddle.y = Math.min(
      gameRoom.playerOne.paddle.y + gameRoom.view.height * 0.01,
      gameRoom.view.height -
        gameRoom.playerOne.paddle.height -
        gameRoom.view.offset -
        gameRoom.view.borderLines
    );
  } else {
    gameRoom.playerTwo.paddle.y = Math.min(
      gameRoom.playerTwo.paddle.y + gameRoom.view.height * 0.01,
      gameRoom.view.height -
        gameRoom.playerTwo.paddle.height -
        gameRoom.view.offset -
        gameRoom.view.borderLines
    );
  }
});

async function moveBall() {
  props.socket.emit("moveBall", props.game.id);
}

props.socket.on("calculateBallMovement", () => {
  if (
    gameRoom.ball.x + gameRoom.ball.moveX >
    gameRoom.view.width -
      gameRoom.ball.radius -
      gameRoom.playerTwo.paddle.width * 2 -
      gameRoom.playerTwo.paddle.offset
  ) {
    if (
      gameRoom.ball.y > gameRoom.playerTwo.paddle.y - gameRoom.ball.radius &&
      gameRoom.ball.y <
        gameRoom.playerTwo.paddle.y +
          gameRoom.playerTwo.paddle.height +
          gameRoom.ball.radius
    ) {
      gameRoom.ball.moveX = -gameRoom.ball.moveX;
    } else {
      gameRoom.ball.moveX = -gameRoom.ball.moveX;
      gameRoom.winner = 1;
      endMatch();
    }
  } else if (
    gameRoom.ball.x + gameRoom.ball.moveX <
    gameRoom.ball.radius +
      gameRoom.playerTwo.paddle.width +
      gameRoom.playerTwo.paddle.offset
  ) {
    if (
      gameRoom.ball.y > gameRoom.playerOne.paddle.y - gameRoom.ball.radius &&
      gameRoom.ball.y <
        gameRoom.playerOne.paddle.y +
          gameRoom.playerOne.paddle.height +
          gameRoom.ball.radius
    ) {
      gameRoom.ball.moveX = -gameRoom.ball.moveX;
    } else {
      gameRoom.ball.moveX = -gameRoom.ball.moveX;
      gameRoom.winner = 2;
      endMatch();
    }
  }
  if (
    gameRoom.ball.y + gameRoom.ball.moveY <
    gameRoom.ball.radius + gameRoom.view.offset - gameRoom.view.borderLines
  ) {
    gameRoom.ball.moveY = -gameRoom.ball.moveY;
  } else if (
    gameRoom.ball.y + gameRoom.ball.moveY >
    gameRoom.view.height - gameRoom.ball.radius - gameRoom.view.offset
  ) {
    gameRoom.ball.moveY = -gameRoom.ball.moveY;
  }
  gameRoom.ball.x += gameRoom.ball.moveX;
  gameRoom.ball.y += gameRoom.ball.moveY;
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

/*********************
 * DRAWING FUNCTIONS *
 *********************/

async function draw() {
  ctx.clearRect(0, 0, gameRoom.view.width, gameRoom.view.height);
  drawCenterLine();
  drawBorderLines();
  drawBall();
  await moveBall();
  drawPaddles();
  drawScoreboard(gameRoom.playerOne.score, gameRoom.playerTwo.score);
  await determineKeyStrokes();
}

function drawScoreboard(playerOneScore: number, playerTwoScore: number) {
  ctx.beginPath();
  ctx.font = gameRoom.view.width * 0.07 + "px ArcadeClassic";
  ctx.fillStyle = "#39ff14";
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

function drawCenterLine() {
  ctx.beginPath();
  ctx.lineWidth = gameRoom.view.width * 0.015;
  ctx.setLineDash([gameRoom.view.width * 0.014, 27]);
  ctx.moveTo(gameRoom.view.width / 2, gameRoom.view.height * 0.05);
  ctx.lineTo(
    gameRoom.view.width / 2,
    gameRoom.view.height - gameRoom.view.height * 0.05
  );
  ctx.strokeStyle = "#FFFFFF";
  ctx.stroke();
  ctx.closePath();
}

function drawBorderLines() {
  ctx.beginPath();
  ctx.setLineDash([0]);
  ctx.lineWidth = gameRoom.view.borderLines;
  ctx.moveTo(gameRoom.view.width * 0.006, gameRoom.view.height * 0.018);
  ctx.lineTo(
    gameRoom.view.width - gameRoom.view.width * 0.006,
    gameRoom.view.height * 0.018
  );
  ctx.moveTo(
    gameRoom.view.width * 0.006,
    gameRoom.view.height - gameRoom.view.height * 0.018
  );
  ctx.lineTo(
    gameRoom.view.width - gameRoom.view.width * 0.006,
    gameRoom.view.height - gameRoom.view.height * 0.018
  );
  ctx.strokeStyle = "white";
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
  ctx.fillStyle = "#FFFFFF";
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
  ctx.fillStyle = "#FFFFFF";
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
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.closePath();
}

const drawCountdown = (count: number) => {
  ctx.beginPath();
  ctx.fillStyle = "#39ff14";
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
  ctx.strokeStyle = "#FFFFFF";
  ctx.stroke();
  ctx.moveTo(
    gameRoom.view.width / 2,
    gameRoom.view.height / 2 + gameRoom.view.height * 0.09
  );
  ctx.lineTo(
    gameRoom.view.width / 2,
    gameRoom.view.height - gameRoom.view.height * 0.05
  );
  ctx.strokeStyle = "#FFFFFF";
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
canvas {
  height: 80%;
  width: 100%;
  color: white;
  display: block;
}
</style>
