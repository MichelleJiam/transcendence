<template>
  <main>
    <div id="display-content">
      <div
        v-if="game.state == GameState.READY"
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
      <div v-else-if="game.state == GameState.WAITING" class="loader">
        <LoaderKnightRider />
      </div>
      <div v-else>
        <PongGame :id="id" class="in-game" :game="game" :socket="socket" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import LoaderKnightRider from "../components/game/loaders/LoaderKnightRider.vue";
import PongGame from "../components/game/PongGame.vue";
import apiRequest, { baseUrl } from "../utils/apiRequest";
import { onUnmounted, ref, onMounted, watchEffect } from "vue";
import { io } from "socket.io-client";
import {
  GameState,
  type Game,
  type GameRoom,
} from "../components/game/pong.types";
import { useUserStore } from "@/stores/UserStore";
import type { AxiosResponse } from "axios";

const userStore = useUserStore();
const id = ref(0);
const socket = io(baseUrl + "/pong");
const game = ref({} as GameRoom);
const activeGames = ref(Array<Game>());
const noGames = ref(true);
game.value.state = GameState.READY;

onMounted(async () => {
  await userStore.retrieveCurrentUserData();
  id.value = userStore.user.id;
  console.log("GamePage.onMounted");
  socket.on("connect", () => {
    console.log(socket.id + " connected from frontend");
  });
  await getActiveGames();
  checkDMGames();
});

// Triggered on navigate away
onUnmounted(async () => {
  console.log("GamePage unmounted");
  // if a player in queue navigates away
  if (game.value.state === GameState.WAITING) {
    removePlayerFromMatchQueue();
  }
  game.value.state = GameState.READY;
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

async function checkDMGames() {
  try {
    const dmGame = await apiRequest(`/game/${id.value}/dm`, "get");
    if (dmGame.data.length !== 0) {
      game.value.state = GameState.WAITING;
      if (dmGame.data.join === false) {
        await startGamePlayer(dmGame, 2);
      } else {
        await startGamePlayer(dmGame, 1);
      }
      game.value.state = GameState.PLAYING;
    }
  } catch (err) {
    console.error("Could not retrieve DM games: ", err);
  }
}

async function getActiveGames() {
  await apiRequest(`/game/active`, "get")
    .then(async (res) => {
      activeGames.value = res.data;
      for (const game of activeGames.value) {
        try {
          const playerOne = await apiRequest(`/user/${game.playerOne}`, "get");
          game.playerOneName = playerOne.data.playerName;
          const playerTwo = await apiRequest(`/user/${game.playerTwo}`, "get");
          game.playerTwoName = playerTwo.data.playerName;
        } catch (err) {
          console.error("Could not retrieve player: ", err);
        }
      }
    })
    .catch((err) => {
      console.debug("Could not retrieve active games: ", err); // not an error
    });
}

async function watchGame(gameId: number) {
  await apiRequest(`/game/${gameId}`, "get")
    .then(async (res) => {
      if (res.data.state !== "playing") {
        alert("This game has already ended");
        window.location.reload();
        return;
      }
      await fillGameRoomObject(res, 0);
      socket.emit("watchGame", game.value); /* adds them to gameRoom */
      console.debug(id.value, " has joined room ", gameId, " as a WATCHER");
      game.value.state = GameState.PLAYING;
    })
    .catch((err) => {
      console.error("Could not retrieve game to watch: ", err);
    });
}

socket.on("savePlayerSockets", (gameRoom: GameRoom) => {
  game.value.playerOne.socket = gameRoom.playerOne.socket;
  game.value.playerTwo.socket = gameRoom.playerTwo.socket;
});

socket.on("addPlayerOne", (gameRoom: GameRoom) => {
  if (game.value.player === 1 && id.value === gameRoom.playerOne.id) {
    game.value = gameRoom;
    game.value.player = 1;
    socket.emit("joinRoom", game.value);
    console.debug(id.value, "has joined room ", game.value.id, " as PLAYER 1");
  }
  if (game.value.player === 1 || game.value.player === 2) {
    game.value.state = GameState.PLAYING;
  }
});

async function startGamePlayer(res: AxiosResponse, player: number) {
  await fillGameRoomObject(res, player);
  socket.emit("joinRoom", game.value);
  console.debug(
    id.value,
    " has joined room ",
    game.value.id,
    " as PLAYER ",
    player
  );
}

const startGame = async () => {
  await apiRequest(`/match/play/${id.value}`, "post", {
    data: { id: id.value, socketId: socket.id },
  })
    .then(async (res) => {
      /* if no one currently in queue */
      if (res.data.id == undefined) {
        game.value.player = 1;
        game.value.state = GameState.WAITING;
      } else {
        /* else if opponent found */
        await startGamePlayer(res, 2);
      }
    })
    .catch((err) => {
      console.error("Could not create match: ", err);
    });
};

// function forfeitGame(gameRoom: GameRoom) {
//   // if user is not actively watching game
//   if (gameRoom.state !== GameState.PLAYING) {
//     return;
//   }
//   socket.emit("forfeitGame", gameRoom);
// }

// Used by GameGateway::handleDisconnect when a watcher or queued player
// disconnects.
// socket.on("disconnection", () => {
//   console.log("Disconnection socket");
//   // if disconnected user was in match queue
//   if (game.value.state === GameState.WAITING) {
//     removePlayerFromMatchQueue();
//   }
//   // if disconnected user was an observer
//   else if (game.value.player === 0) {
//     game.value.state = GameState.READY;
//   }
// });

async function removePlayerFromMatchQueue() {
  await apiRequest(`/match/${id.value}`, "delete").catch((err) => {
    console.error(
      "Something went wrong with deleting the player from match queue: ",
      err
    );
  });
}

function fillPlayerObject(
  playerNumber: number,
  playerName: string,
  playerSocket: string,
  score: number
) {
  return {
    id: playerNumber,
    name: playerName,
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

async function fillGameRoomObject(res: AxiosResponse, playerNumber: number) {
  game.value.id = res.data.id;
  game.value.player = playerNumber;
  const playerOne = await apiRequest(`/user/${res.data.playerOne}`, "get");
  const playerTwo = await apiRequest(`/user/${res.data.playerTwo}`, "get");
  /* if player is a watcher */
  if (playerNumber === 0) {
    game.value.playerOne = fillPlayerObject(
      res.data.playerOne,
      playerOne.data.playerName,
      res.data.playerOneSocket,
      res.data.playerOneScore
    );
    game.value.playerTwo = fillPlayerObject(
      res.data.playerTwo,
      playerTwo.data.playerName,
      res.data.playerTwoSocket,
      res.data.playerTwoScore
    );
  } else {
    /* else if player 2 */
    game.value.playerOne = fillPlayerObject(
      res.data.playerOne,
      playerOne.data.playerName,
      "",
      0
    );
    game.value.playerTwo = fillPlayerObject(
      res.data.playerTwo,
      playerTwo.data.playerName,
      "",
      0
    );
  }
}
</script>

<style scoped>
#display-content {
  align-items: center;
  justify-items: center;
  width: 60%;
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

@media (max-width: 1100px) {
  .main-game {
    display: grid;
    grid-template-rows: 1fr 2fr;
    grid-template-columns: none;
  }
}
</style>
