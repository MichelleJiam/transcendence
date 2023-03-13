<template>
  <main>
    <div id="display-content">
      <div
        v-if="game.state == State.READY"
        class="main-game"
        :class="{ active: noGames }"
      >
        <div class="start-game">
          <button
            class="game-button"
            :class="{ activebutton: noGames }"
            @click="startGame"
          >
            PLAY GAME
          </button>
        </div>
        <div class="watch-games" :class="{ nolive: noGames }">
          <h2>WATCH LIVE!</h2>
          <div class="game-list">
            <button
              v-for="activeGame in activeGames"
              :key="activeGame.id"
              class="small-btn"
              @click="watchGame(activeGame.id)"
            >
              <span>{{ activeGame.playerOneName }}</span>
              <span>vs.</span>
              <span>{{ activeGame.playerTwoName }}</span>
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
import apiRequest, { baseUrl } from "../utils/apiRequest";
import { onBeforeMount, onUnmounted, ref, onMounted, watchEffect } from "vue";
import { io } from "socket.io-client";
import {
  UserStatus,
  type Game,
  type GameRoom,
} from "../components/game/pong.types";
import { useUserStore } from "@/stores/UserStore";
import { updateUserStatus } from "@/utils/userStatus";
import type { AxiosResponse } from "axios";

const State = {
  READY: 0,
  WAITING: 1,
  PLAYING: 2,
};

const userStore = useUserStore();
const id = ref(0);
const socket = io(baseUrl + "/pong");
const game = ref({} as GameRoom);
const activeGames = ref(Array<Game>());
const noGames = ref(true);
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
  console.log("id ", id.value);
  console.log("GamePage.onMounted");
  socket.on("connect", () => {
    console.log(socket.id + " connected from frontend");
  });

  const dmGame = await apiRequest(`/game/${id.value}/dm`, "get");
  if (dmGame.data.length !== 0) {
    game.value.state = State.WAITING;
    if (dmGame.data.join === false) {
      startGamePlayer(dmGame, 2);
    } else {
      startGamePlayer(dmGame, 1);
    }
    game.value.state = State.PLAYING;
  }
});

// Triggered on navigate away
onUnmounted(async () => {
  console.log("GamePage unmounted");
  // If a watcher or player navigates away during an active game
  if (game.value.state === State.PLAYING) {
    socket.emit("activeGameLeft", game.value);
    await updateUserStatus(id.value, UserStatus.ONLINE);
  }
  // if a player in queue navigates away
  else if (game.value.state === State.WAITING) {
    removePlayerFromMatchQueue();
  }
  game.value.state = State.READY;
});

watchEffect(() => {
  if (activeGames.value.length > 0) {
    noGames.value = false;
  } else {
    noGames.value = true;
  }
});

socket.on("updateActiveGames", async () => {
  await getActiveGames();
});

async function getActiveGames() {
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

socket.on("savePlayerSockets", (gameRoom: GameRoom) => {
  game.value.playerOne.socket = gameRoom.playerOne.socket;
  game.value.playerTwo.socket = gameRoom.playerTwo.socket;
});

socket.on("addPlayerOne", async (gameRoom: GameRoom) => {
  if (game.value.player === 1 && id.value === gameRoom.playerOne.id) {
    game.value = gameRoom;
    game.value.player = 1;
    socket.emit("joinRoom", game.value);
    console.log(id.value, "has joined room ", game.value.id, " as PLAYER 1");
  }
  if (game.value.player === 1 || game.value.player === 2) {
    game.value.state = State.PLAYING;
  }
});

function startGamePlayer(res: AxiosResponse, player: number) {
  fillGameRoomObject(res, player);
  socket.emit("joinRoom", game.value);
  console.log(
    id.value,
    " has joined room ",
    game.value.id,
    " as PLAYER ",
    player
  );
}

const startGame = async () => {
  const res = await apiRequest(`/match/play/${id.value}`, "post", {
    data: { id: id.value, socketId: socket.id },
  });
  /* if no one currently in queue */
  if (res.data.id == undefined) {
    game.value.player = 1;
    game.value.state = State.WAITING;
  } else {
    /* else if opponent found */
    startGamePlayer(res, 2);
  }
};

async function gameOver(gameRoom: GameRoom) {
  console.log(
    "GamePage.gameOver | ",
    gameRoom.id,
    " p1 score: ",
    gameRoom.playerOne.score,
    " p2 score: ",
    gameRoom.playerTwo.score
  );
  // can fail if both players disconnected and game was deleted
  if (game.value.player !== 0) {
    await apiRequest(`/game`, "put", { data: gameRoom }).catch((err) => {
      console.log("Something went wrong with updating with game result: ", err);
    });
}
  game.value.state = State.READY;
  socket.emit("leaveRoom", gameRoom.id);
  console.log("GamePage | ", id.value, " left room ", gameRoom.id);
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
  console.log("Disconnection socket");
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

/* class styling when no games available to watch */
.active {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
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

/* styling when there are no games available to watch */
.nolive {
  display: none;
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
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
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

.activebutton {
  font-size: 8em;
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
