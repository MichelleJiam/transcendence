<template>
  <main>
    <div id="display-content">
      <div v-if="game.state == State.READY" class="main-game">
        <div class="start-game">
          <button class="game-button" @click="startGame">PLAY GAME</button>
        </div>
        <div class="watch-games">
          <h2>WATCH LIVE!</h2>
          <div class="game-list">
            <button
              v-for="activeGame in activeGames"
              :key="activeGame.id"
              class="small-btn"
              @click="watchGame(activeGame.id)"
            >
              {{ activeGame.playerOneName }} vs.
              {{ activeGame.playerTwoName }}
            </button>
          </div>
        </div>
      </div>
      <div v-else-if="game.state == State.WAITING" class="loader">
        <LoaderKnightRider />
      </div>
      <div v-else>
        <PongGame
          :id="id"
          class="in-game"
          :game="game"
          :socket="socket"
          @game-over="gameOver"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import LoaderKnightRider from "../components/game/loaders/LoaderKnightRider.vue";
import PongGame from "../components/game/PongGame.vue";
import apiRequest from "../utils/apiRequest";
import { onBeforeMount, onUnmounted, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";
import type { Game, GameRoom } from "../components/game/pong.types";
import type { AxiosResponse } from "axios";
import { useUserStore } from "@/stores/UserStore";

const State = {
  READY: 0,
  WAITING: 1,
  PLAYING: 2,
};

// const route = useRoute();
// const id = route.params.id as string;
const userStore = useUserStore();
const id = ref(0);
const socket = io("http://localhost:3000/pong");
const game = ref({} as GameRoom);
const activeGames = ref(Array<Game>());
game.value.state = State.READY;

// remove?
onBeforeMount(async () => {
  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected from frontend");
  });
  await getActiveGames();
});

onMounted(async () => {
  await userStore.retrieveCurrentUserData();
  id.value = userStore.user.id;
  // await apiRequest(
  //   // `/match/${id.value}`,
  //   `/match/${id}`,
  //   "delete"
  // ); /* protection if user refreshes; removes them from queue */
  console.log("GamePage.onMounted");
  socket.on("connect", () => {
    console.log(socket.id + " connected from frontend");
  });
  await getActiveGames();
});

// Triggered on navigate away
onUnmounted(async () => {
  console.log("GamePage unmounted");
  // If a watcher or player navigates away during an active game
  if (game.value.state === State.PLAYING) {
    socket.emit("activeGameLeft", game.value);
  }
  // if a player in queue navigates away
  else if (game.value.state === State.WAITING) {
    removePlayerFromMatchQueue();
  }
  game.value.state = State.READY;
});

socket.on("updateActiveGames", async () => {
  await getActiveGames();
});

async function getActiveGames() {
  console.log("getting active games");
  const res = await apiRequest(`/game/active`, "get");
  activeGames.value = res.data;
  for (const game of activeGames.value) {
    const playerOne = await apiRequest(`/user/${game.playerOne}`, "get");
    game.playerOneName = playerOne.data.playerName;
    const playerTwo = await apiRequest(`/user/${game.playerTwo}`, "get");
    game.playerTwoName = playerTwo.data.playerName;
  }
}

async function watchGame(gameId: number) {
  // const res = await apiRequest(`/game/${gameId}`, "get");
  const res = await apiRequest(`/game/${gameId}`, "get");
  console.log("watchGame | retrieved game state: ", res.data.state);
  if (res.data.state !== "playing") {
    alert("This game has already ended");
    window.location.reload();
    return;
  }
  fillGameRoomObject(res, 0);
  socket.emit("watchGame", game.value); /* adds them to gameRoom */
  console.log(id.value, " has joined room ", gameId, " as a WATCHER");
  game.value.state = State.PLAYING;
}

const startGame = async () => {
  // const res = await apiRequest(`/match/play/${id.value}`, "get");
  const res = await apiRequest(`/match/play/${id.value}`, "get");
  /* if no one currently in queue */
  if (res.data.id == undefined) {
    game.value.state = State.WAITING;
  } else {
    /* else if opponent found */
    fillGameRoomObject(res, 2);
    game.value.state = State.PLAYING;
    await socket.emit("joinRoom", game.value);
    console.log(id.value, " has joined room ", game.value.id, " as PLAYER 2");
  }
};

socket.on("savePlayerSockets", (gameRoom: GameRoom) => {
  if (game.value.state === State.PLAYING) {
    game.value.playerOne.socket = gameRoom.playerOne.socket;
    game.value.playerTwo.socket = gameRoom.playerTwo.socket;
  }
});

socket.on("addPlayerOne", async (gameRoom: GameRoom) => {
  if (game.value.state == State.WAITING) {
    game.value = gameRoom;
    game.value.player = 1;
    await socket.emit("joinRoom", game.value);
    console.log(id.value, "has joined room ", game.value.id, " as PLAYER 1");
  }
});

async function gameOver(gameRoom: GameRoom) {
  console.log(
    "GamePage.gameOver | ",
    gameRoom.id,
    " p1 score: ",
    gameRoom.playerOne.score,
    " p2 score: ",
    gameRoom.playerTwo.score
  );
  game.value.state = State.READY;
  socket.emit("leaveRoom", gameRoom.id);
  console.log("GamePage | ", id.value, " left room ", gameRoom.id);
  // can fail if both players disconnected and game was deleted
  await apiRequest(`/game`, "put", { data: gameRoom }).catch((err) => {
    console.log("Something went wrong with updating with game result: ", err);
  });
  await getActiveGames();
}

socket.on("playerForfeited", async (disconnectedPlayer: number) => {
  // console.log(
  //   "playerForfeited | p1 socket: ",
  //   game.value.playerOne.socket,
  //   " p2 socket: ",
  //   game.value.playerTwo.socket
  // );
  // if user is not actively watching game
  if (game.value.state !== State.PLAYING) {
    return;
  }
  if (disconnectedPlayer === 1) {
    console.log("Player 1 forfeited");
    game.value.playerOne.disconnected = true;
  } else {
    console.log("Player 2 forfeited");
    game.value.playerTwo.disconnected = true;
  }
  socket.emit("forfeitGame", game.value);
});

// Used by GameGateway::handleDisconnect when a watcher or queued player
// disconnects.
socket.on("disconnection", () => {
  // if disconnected user was in match queue
  if (game.value.state === State.WAITING) {
    removePlayerFromMatchQueue();
  }
  // if disconnected user was an observer
  else if (game.value.player === 0) {
    game.value.state = State.READY;
  }
});

async function removePlayerFromMatchQueue() {
  await apiRequest(`/match/${id.value}`, "delete").catch((err) => {
    console.log(
      "Something went wrong with deleting the player from match queue: ",
      err
    );
  });
}

function fillPlayerObject(
  playerNumber: number,
  playerSocket: string,
  score: number
) {
  return {
    id: playerNumber,
    socket: playerSocket,
    score: score,
    paddle: {
      height: 0,
      width: 0,
      y: 0,
      offset: 0,
    },
    disconnected: false,
  };
}

function fillGameRoomObject(res: AxiosResponse, playerNumber: number) {
  game.value.id = res.data.id;
  game.value.player = playerNumber;
  /* if player is a watcher */
  if (playerNumber === 0) {
    game.value.playerOne = fillPlayerObject(
      res.data.playerOne,
      res.data.playerOneSocket,
      res.data.playerOneScore
    );
    game.value.playerTwo = fillPlayerObject(
      res.data.playerTwo,
      res.data.playerTwoSocket,
      res.data.playerTwoScore
    );
  } else {
    /* else if player 2 */
    game.value.playerOne = fillPlayerObject(res.data.playerOne, "", 0);
    game.value.playerTwo = fillPlayerObject(res.data.playerTwo, "", 0);
  }
}
</script>

<style scoped>
#display-content {
  /* display: flex; */
  /* height: 80%; */
  align-items: center;
  justify-items: center;
}
.main-game {
  display: grid;
  grid-template-columns: 60% 40%;
  justify-items: stretch;
  align-items: stretch;
  height: 100%;
  overflow: hidden;
}

.start-game {
  align-self: center;
}

.watch-games {
  height: 100%;
  overflow: scroll;
  display: flex;
  gap: 10px;
  flex-direction: column;
  justify-content: center;
}

.watch-games button {
  width: 100%;
}

.watch-games > h2 {
  font-size: 4em;
  word-spacing: 15px;
}

.game-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  overflow-y: scroll;
}

.game-list > button {
  /* TODO TOMORROW MAKE GRID */
}

.in-game {
  align-self: center;
  justify-self: center;
}

p {
  font-family: "ArcadeClassic", sans-serif;
  font-size: 6vw;
}

button:hover {
  color: #39ff14;
  background-color: #1c1b1b;
}

.game-button {
  font-size: 4em;
}

button {
  padding-right: 30px;
  padding-left: 30px;

  word-spacing: 3vw;
}

.loader {
  height: 50%;
  width: 50%;
  display: block;
}
</style>
