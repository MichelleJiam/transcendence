<template>
  <main>
    <div id="display-content">
      <div v-if="game.state == State.READY" class="btn">
        <button @click="startGame">PLAY GAME</button>
        <div class="watch-games">
          WATCH LIVE!
          <div v-for="activeGame in activeGames" :key="activeGame.id">
            <button class="small-btn" @click="watchGame(activeGame.id)">
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
const game = ref({} as GameRoom);
const activeGames = ref(Array<Game>());
game.value.state = State.READY;

onBeforeMount(async () => {
  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected from frontend");
  });
  await getActiveGames();
});

onMounted(async () => {
  // await userStore.retrieveCurrentUserData();
  // id.value = userStore.user.id;
  // await apiRequest(
  //   // `/match/${id.value}`,
  //   `/match/${id}`,
  //   "delete"
  // ); /* protection if user refreshes; removes them from queue */
  socket.on("connect", () => {
    console.log(socket.id + " connected from frontend");
  });
});

onUnmounted(async () => {
  console.log("GamePage unmounted");
  if (game.value.state === State.PLAYING) {
    socket.emit("someoneLeft", game.value);
  }
  // await apiRequest(`/match/${id.value}`, "delete");
  await apiRequest(`/match/${id}`, "delete").catch((err) => {
    console.log("Something went wrong with deleting the match: ", err);
  });
});

// // not used?
// socket.on("disconnecting", (socket) => {
//   socket.emit("socketRooms", socket.rooms);
// });

socket.on("updateActiveGames", () => {
  getActiveGames();
});

async function getActiveGames() {
  const res = await apiRequest(`/game/active`, "get");
  activeGames.value = res.data;
  for (const element of activeGames.value) {
    const playerOne = await apiRequest(`/user/${element.playerOne}`, "get");
    element.playerOneName = playerOne.data.playerName;
    const playerTwo = await apiRequest(`/user/${element.playerTwo}`, "get");
    element.playerTwoName = playerTwo.data.playerName;
  }
}

async function watchGame(gameId: number) {
  // const res = await apiRequest(`/game/${gameId}`, "get");
  const res = await apiRequest(`/game/${gameId}`, "get");
  fillGameRoomObject(res, 0);
  socket.emit("watchGame", game.value); /* adds them to gameRoom */
  console.log(id, " has joined room ", gameId, " as a WATCHER");
  game.value.state = State.PLAYING;
}

const startGame = async () => {
  // const res = await apiRequest(`/match/play/${id.value}`, "get");
  const res = await apiRequest(`/match/play/${id}`, "get");
  /* if no one currently in queue */
  if (res.data.id == undefined) {
    game.value.state = State.WAITING;
  } else {
    /* else if opponent found */
    fillGameRoomObject(res, 2);
    game.value.state = State.PLAYING;
    socket.emit("joinRoom", game.value);
    console.log(id, " has joined room ", game.value.id, " as PLAYER 2");
  }
};

socket.on("addPlayerOne", (gameRoom: GameRoom) => {
  if (game.value.state == State.WAITING) {
    game.value = gameRoom;
    game.value.player = 1;
    socket.emit("joinRoom", game.value);
    console.log(id, "has joined room ", game.value.id, " as PLAYER 1");
  }
});

async function gameOver(gameRoom: GameRoom) {
  game.value.state = State.READY;
  socket.emit("leaveRoom", gameRoom.id);
  console.log("GamePage | ", id, " left room ", gameRoom.id);
  await apiRequest(`/game`, "put", { data: gameRoom });
  await getActiveGames();
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
main {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

p {
  font-family: "ArcadeClassic", sans-serif;
  font-size: 6vw;
}

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
  word-spacing: 3vw;
}

.btn {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.small-btn {
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
.watch-games {
  height: 50%;
  width: 100%;
  background: #1c1b1b;
  color: white;
  font-family: "ArcadeClassic", sans-serif;
  font-size: 6vw;
  padding-top: 5%;
  cursor: pointer;
  border-radius: 5px;
  text-align: center;
  display: block;
  word-spacing: 3vw;
}
</style>
