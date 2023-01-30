<!--
    this should be the main page layout
    so the basic nav bar and the content div
    then there should be different components that render
    on different circumstances
-->

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
        <PongGame />
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
const id = route.params.id;
const socket = io("http://localhost:3000/pong");
const showStartButton = ref(true);
const showWatchButton = ref(true);
const gameState = ref(State.READY);
const joined = ref(false);

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
  if (joined.value == false) {
    socket.emit("joinRoom", data);
    console.log(id, "has joined room ", data);
    joined.value = true;
    gameState.value = State.PLAYING;
  }
});

const startGame = async () => {
  const res = await apiRequest(`/match/${id}`, "get");
  if (res.data.id == undefined) {
    gameState.value = State.WAITING;
  } else {
    socket.emit("joinRoom", res.data.id);
    console.log(id, " has joined room ", res.data.id);
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
