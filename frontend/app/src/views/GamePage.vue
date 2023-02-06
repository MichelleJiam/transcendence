<template>
  <main>
    <div id="display-content">
      <div v-if="gameState == State.READY" class="my-btn">
        <button class="btn" @click="startGame">PLAY</button>
        <button class="btn">WATCH</button>
      </div>
      <div v-else-if="gameState == State.WAITING" class="loader">
        <LoaderKnightRider />
      </div>
      <div v-else>
        <PongGame :id="id" :gameid="gameId" :player="player" :socket="socket" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import LoaderKnightRider from "../components/game/loaders/LoaderKnightRider.vue";
import PongGame from "../components/game/PongGame.vue";
import apiRequest from "../utils/apiRequest";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";
import { onMounted } from "vue";

const State = {
  READY: 0,
  WAITING: 1,
  PLAYING: 2,
  DONE: 3,
};

const route = useRoute();
const id = route.params.id as string;
const socket = io("http://localhost:3000/pong");
const showStartButton = ref(true);
const showWatchButton = ref(true);
const gameState = ref(State.READY);
const joined = ref(false);
const gameId = ref("");
const player = ref("");

onBeforeMount(() => {
  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected from frontend");
  });
});

onMounted(() => {
  socket.on("connect", () => {
    console.log(socket.id + " connected from frontend");
  });
});

socket.on("addPlayerOne", (data) => {
  if (joined.value == false && gameState.value == State.WAITING) {
    gameId.value = data.toString();
    socket.emit("joinRoom", gameId.value);
    player.value = "1";
    console.log(id, "has joined room ", gameId.value);
    joined.value = true;
    gameState.value = State.PLAYING;
  }
});

const startGame = async () => {
  const res = await apiRequest(`/match/${id}`, "get");
  if (res.data.id == undefined) {
    gameState.value = State.WAITING;
  } else {
    gameId.value = res.data.id.toString();
    socket.emit("joinRoom", gameId.value);
    player.value = "2";
    console.log(id, " has joined room ", gameId.value);
    gameState.value = State.PLAYING;
    joined.value = true;
    showStartButton.value = false;
    showWatchButton.value = false;
  }
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
