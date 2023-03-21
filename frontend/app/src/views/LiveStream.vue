<template>
  <main>
    <div id="display-content">
      <div v-if="game.state == State.READY" class="my-btn">
        <div v-for="activeGame in activeGames" :key="activeGame.id">
          <button class="my-small-btn" @click="watchGame(activeGame.id)">
            {{ activeGame.playerOneName }} vs.
            {{ activeGame.playerTwoName }}
          </button>
        </div>
      </div>
      <!-- <div v-else>
        <PongGame :game="game" :socket="socket" @game-over="gameOver" />
      </div> -->
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Game, GameRoom } from "../components/game/pong.types";
import apiRequest, { baseUrl } from "../utils/apiRequest";
import { io } from "socket.io-client";
// import PongGame from "../components/game/PongGame.vue";

const State = {
  READY: 0,
  WAITING: 1,
  PLAYING: 2,
};

const activeGames = ref(Array<Game>());
const game = ref({} as GameRoom);
const socket = io(baseUrl + "/pong");
game.value.state = State.READY;

async function gameOver(gameRoom: GameRoom) {
  game.value.state = State.READY;
  socket.emit("leaveRoom", gameRoom.id);
  // console.log(id, "has left room ", gameRoom.id);
  socket.emit("updateActiveGames");
}

async function watchGame(gameId: number) {
  // const res = await apiRequest(`/game/${gameId}`, "get");
  const res = await apiRequest(`/game/${gameId}`, "get");
  console.log(res.data);
  game.value.id = res.data.gameId;
  game.value.player = 0;
  game.value.playerOne = {
    id: res.data.playerOne.id,
    socket: res.data.playerOne.socket,
    score: res.data.playerOne.score,
    paddle: {
      height: 0,
      width: 0,
      y: 0,
      offset: 0,
    },
  };
  game.value.playerTwo = {
    id: res.data.playerTwo.id,
    socket: res.data.playerTwo.socket,
    score: res.data.playerTwo.score,
    paddle: {
      height: 0,
      width: 0,
      y: 0,
      offset: 0,
    },
  };
  game.value.state = State.PLAYING;
  socket.emit("watchGame", game.value); /* adds them to gameRoom */
  // console.log(id, " has joined room ", gameId, " as a WATCHER");
}

socket.on("updateActiveGames", () => {
  getActiveGames();
});

async function getActiveGames() {
  const res = await apiRequest(`/game/active`, "get");
  activeGames.value = res.data;
  for (let i = 0; i < activeGames.value.length; i++) {
    const playerOne = await apiRequest(
      `/user/${activeGames.value[i].playerOne}`,
      "get"
    );
    activeGames.value[i].playerOneName = playerOne.data.playerName;
    const playerTwo = await apiRequest(
      `/user/${activeGames.value[i].playerTwo}`,
      "get"
    );
    activeGames.value[i].playerTwoName = playerTwo.data.playerName;
  }
}
</script>

<style scoped>
h1 {
  font-size: 10rem;
}
.my-small-btn {
  height: 100%;
  width: 50%;
  background: #1c1b1b;
  color: white;
  font-family: "ArcadeClassic", sans-serif;
  font-size: 2vw;
  cursor: pointer;
  border-radius: 5px;
  text-align: center;
  border: 2px #302d2d solid;
  display: block, center;
}
button:hover {
  color: #39ff14;
  background-color: #1c1b1b;
}
</style>
