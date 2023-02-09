<template>
  <main>
    <div id="display-content">
      <div v-if="game.state == State.READY" class="my-btn">
        <button class="btn" @click="startGame">PLAY</button>
        <button class="btn" @click="watchGame">WATCH</button>
      </div>
      <div v-else-if="game.state == State.WAITING" class="loader">
        <LoaderKnightRider />
      </div>
      <div v-else>
        <PongGame
          :id="id"
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
import { onBeforeMount, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";
import { onMounted } from "vue";
import type { Game, GameRoom } from "../components/game/pong.types";

const State = {
  READY: 0,
  WAITING: 1,
  PLAYING: 2,
};

const route = useRoute();
const id = route.params.id as string;
const socket = io("http://localhost:3000/pong");
const showStartButton = ref(true);
const showWatchButton = ref(true);
const joined = ref(false);
const game = ref({} as Game);
game.value.state = State.READY;

function gameOver(gameRoom: GameRoom) {
  socket.emit("updateGameStats", gameRoom);
  game.value.state = State.READY;
  socket.emit("leaveRoom", game);
  joined.value = false;
  console.log(id, "has left room ", game.value.id);
  // implement api call to update game stats - need child to send this data here?
}

onBeforeMount(async () => {
  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected from frontend");
  });
});

onMounted(async () => {
  await apiRequest(
    `/match/${id}`,
    "delete"
  ); /* protection if user refreshes; removes them from queue */
  socket.on("connect", () => {
    console.log(socket.id + " connected from frontend");
  });
});

onUnmounted(async () => {
  console.log("unmounted");
  await apiRequest(`/match/${id}`, "delete");
});

socket.on("addPlayerOne", (gameData: Game) => {
  if (joined.value == false && game.value.state == State.WAITING) {
    console.log(gameData.id.toString());
    game.value = {
      id: gameData.id,
      player: 1,
      playerOne: gameData.playerOne,
      playerTwo: gameData.playerTwo,
      state: State.PLAYING,
    };
    socket.emit("joinRoom", gameData);
    joined.value = true;
    console.log(id, "has joined room ", gameData.id);
  }
});

const startGame = async () => {
  const res = await apiRequest(`/match/${id}`, "get");
  if (res.data.id == undefined) {
    game.value.state = State.WAITING;
  } else {
    game.value = {
      id: res.data.id.toString(),
      player: 2,
      playerOne: res.data.playerOne,
      playerTwo: res.data.playerTwo,
      state: State.PLAYING,
    };
    socket.emit("joinRoom", res.data);
    console.log(id, " has joined room ", game.value.id);
    joined.value = true;
    showStartButton.value = false;
    showWatchButton.value = false;
  }
};

const watchGame = async () => {
  // make backend call to see if there are any games in a playing state
  // return first one and then let player join the room
};
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

p {
  font-family: "ArcadeClassic", sans-serif;
  font-size: 6vw;
}

button {
  height: 50%;
  width: 100%;
  background: #1c1b1b;
  color: white;
  font-family: "ArcadeClassic", sans-serif;
  font-size: 10vw;
  cursor: pointer;
  border-radius: 5px;
  text-align: center;
  border: 2px #302d2d solid;
  display: block;
}
button:hover {
  color: #39ff14;
  background-color: #1c1b1b;
}
.my-btn {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.loader {
  height: 50%;
  width: 100%;
  display: block;
}
</style>
