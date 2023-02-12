<template>
  <main>
    <div id="display-content">
      <div v-if="game.state == State.READY" class="my-btn">
        <button @click="startGame">PLAY GAME</button>
        <button>SELECT MODE</button>
        <PongMain />
        <PongWatch />
        <!-- <button class="btn" @click="startGame">PLAY</button>
        <button class="btn" @click="watchGame">WATCH</button> -->
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
import PongMain from "../components/game/PongMain.vue";
import PongWatch from "../components/game/PongWatch.vue";
import apiRequest from "../utils/apiRequest";
import { onBeforeMount, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";
import { onMounted } from "vue";
import type { GameRoom } from "../components/game/pong.types";

const State = {
  READY: 0,
  WAITING: 1,
  PLAYING: 2,
};

const route = useRoute();
const id = route.params.id as string;
const socket = io("http://localhost:3000/pong");
const joined = ref(false);
const game = ref({} as GameRoom);
game.value.state = State.READY;

async function gameOver(gameRoom: GameRoom) {
  game.value = gameRoom;
  game.value.state = State.READY;
  socket.emit("leaveRoom", gameRoom.id);
  joined.value = false;
  console.log(id, "has left room ", gameRoom.id);
  await apiRequest(`/game`, "put", { data: gameRoom });
}

socket.on("disconnecting", (socket) => {
  socket.emit("socketRooms", socket.rooms);
});

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

socket.on("addPlayerOne", (gameRoom: GameRoom) => {
  if (joined.value == false && game.value.state == State.WAITING) {
    game.value = gameRoom;
    game.value.player = 1;
    socket.emit("joinRoom", game.value);
    joined.value = true;
    console.log(id, "has joined room ", game.value.id);
  }
});

const startGame = async () => {
  const res = await apiRequest(`/match/${id}`, "get");
  if (res.data.id == undefined) {
    game.value.state = State.WAITING;
  } else {
    game.value.id = res.data.id;
    game.value.player = 2;
    game.value.playerOne = {
      id: res.data.playerOne,
      socket: "",
      score: 0,
      paddle: {
        height: 0,
        width: 0,
        y: 0,
        offset: 0,
      },
    };
    game.value.playerTwo = {
      id: res.data.playerTwo,
      socket: "",
      score: 0,
      paddle: {
        height: 0,
        width: 0,
        y: 0,
        offset: 0,
      },
    };
    game.value.state = State.PLAYING;
    socket.emit("joinRoom", game.value);
    console.log(id, " has joined room ", game.value.id);
    joined.value = true;
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
  /* height: 50%;
  width: 100%; */
  height: 10%;
  width: 20%;
  background: #1c1b1b;
  color: white;
  font-family: "ArcadeClassic", sans-serif;
  font-size: 2vw;
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
/* .my-btn {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
} */
.loader {
  height: 50%;
  width: 100%;
  display: block;
}
</style>
