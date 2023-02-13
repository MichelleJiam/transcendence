<template>
  <div id="display-content">
    <!-- <p>Watch</p> -->
    <!-- <div v-for="game in games" :key="game.id">
      <button @click="watchGame(game.id)">
        {{ game.playerOne }} vs. {{ game.playerTwo }}
      </button>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import type { Game, GameRoom } from "./pong.types";
// import apiRequest from "../../utils/apiRequest";
// import { onBeforeMount, ref } from "vue";
import { Socket } from "socket.io-client";

// const game = ref({} as GameRoom);

// const props = defineProps({
//   socket: { type: Socket, required: true },
// });

// const games = ref(Array<Game>());

// onBeforeMount(async () => {
//   await getActiveGames();
// });

// async function getActiveGames() {
//   const res = await apiRequest(`/game/active`, "get");
//   console.log(res.data);
//   games.value = res.data;
// }

// function watchGame(gameId: number) {
//   const game = props.socket.emit("watchGame", gameId);
//   console.log(game);
//   // build view for watcher
// }
</script>

<style scoped>
p {
  font-family: "ArcadeClassic", sans-serif;
  font-size: 3vw;
}
</style>
