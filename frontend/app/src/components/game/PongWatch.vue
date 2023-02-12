<template>
  <div id="display-content">
    <p>Watch</p>
    <button>yo</button>
  </div>
</template>

<script setup lang="ts">
import type { Game } from "./pong.types";
// import apiRequest from "../utils/apiRequest";
import { ref } from "vue";

const games = ref(Array<Game>());

async function getActiveGames() {
  await apiRequest(`/game`, "get");
}

// cycle through games in play
</script>

<style scoped>
p {
  font-family: "ArcadeClassic", sans-serif;
  font-size: 3vw;
}
</style>
