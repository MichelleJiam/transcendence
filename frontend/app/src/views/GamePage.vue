<template>
  <main>
    <div id="display-content">
      <div v-if="game.state == State.READY" class="my-btn">
        <button @click="startGame">PLAY GAME</button>
        <div v-for="activeGame in activeGames" :key="activeGame.id">
          <button class="my-small-btn" @click="watchGame(activeGame.id)">
            {{ activeGame.playerOneName }} vs.
            {{ activeGame.playerTwoName }}
          </button>
        </div>
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
// import { useUserStore } from "@/stores/UserStore";

const State = {
  READY: 0,
  WAITING: 1,
  PLAYING: 2,
};

const route = useRoute();
const id = route.params.id as string;
// const userStore = useUserStore();
// const id = ref(0);
const socket = io("http://localhost:3000/pong");
const joined = ref(false);
const game = ref({} as GameRoom);
const activeGames = ref(Array<Game>());
game.value.state = State.READY;

async function gameOver(gameRoom: GameRoom) {
  game.value.state = State.READY;
  socket.emit("leaveRoom", gameRoom.id);
  joined.value = false;
  console.log(id, "has left room ", gameRoom.id);
  await apiRequest(`/game`, "put", { data: gameRoom });
  socket.emit("updateActiveGames");
  // clear all gameRoom values somehow? Is that needed?
}

socket.on("disconnecting", (socket) => {
  socket.emit("socketRooms", socket.rooms);
});

onBeforeMount(async () => {
  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected from frontend");
  });
  await getActiveGames();
});

onMounted(async () => {
  // await userStore.retrieveCurrentUserData();
  // id.value = userStore.user.id;
  await apiRequest(
    // `/match/${id.value}`,
    `/match/${id}`,
    "delete"
  ); /* protection if user refreshes; removes them from queue */
  socket.on("connect", () => {
    console.log(socket.id + " connected from frontend");
  });
});

onUnmounted(async () => {
  console.log("unmounted");
  // await apiRequest(`/match/${id.value}`, "delete");
  await apiRequest(`/match/${id}`, "delete");
});

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

async function watchGame(gameId: number) {
  const res = await apiRequest(`/game/${gameId}`, "get");

  game.value.id = res.data.id;
  game.value.player = 0;
  game.value.playerOne = {
    id: res.data.playerOne.id,
    socket: res.data.playerOneSocket,
    score: res.data.playerOneScore,
    paddle: {
      height: 0,
      width: 0,
      y: 0,
      offset: 0,
    },
  };
  game.value.playerTwo = {
    id: res.data.playerTwo.id,
    socket: res.data.playerTwoSocket,
    score: res.data.playerTwoScore,
    paddle: {
      height: 0,
      width: 0,
      y: 0,
      offset: 0,
    },
  };
  socket.emit("watchGame", game.value); /* adds them to gameRoom */
  console.log(id, " has joined room ", gameId, " as a WATCHER");
  game.value.state = State.PLAYING;
  joined.value = true;
}

socket.on("addPlayerOne", (gameRoom: GameRoom) => {
  if (joined.value == false && game.value.state == State.WAITING) {
    game.value = gameRoom;
    game.value.player = 1;
    socket.emit("joinRoom", game.value);
    joined.value = true;
    console.log(id, "has joined room ", game.value.id, " as PLAYER 1");
    socket.emit("updateActiveGames");
  }
});

const startGame = async () => {
  // const res = await apiRequest(`/match/${id.value}`, "get");
  const res = await apiRequest(`/match/${id}`, "get");
  if (res.data.id == undefined) {
    game.value.state = State.WAITING;
  } else {
    console.log("gameAfterCreation: ", res.data);
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
    console.log(id, " has joined room ", game.value.id, " as PLAYER 2");
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

/* button {
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
  display: block, center;
} */
button:hover {
  color: #39ff14;
  background-color: #1c1b1b;
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
/* button:hover {
  color: #39ff14;
} */
.my-btn {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
.loader {
  height: 50%;
  width: 50%;
  display: block;
}
</style>
