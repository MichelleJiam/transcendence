<template>
  <div class="container">
    <h1 class="pt-3 pb-3">Games currently in database</h1>
    <div class="container">
      <div class="row">
        <div class="col-sm"><b>Game Id</b></div>
        <div class="col-sm"><b>Winner</b></div>
        <div class="col-sm"><b>Winner Score</b></div>
        <div class="col-sm"><b>Loser</b></div>
        <div class="col-sm"><b>Loser Score</b></div>
        <br />
        <br />
      </div>
      <div v-for="game in games" :key="game" class="row">
        <div class="col-sm">{{ game.id }}</div>
        <div class="col-sm">{{ game.winnerId }}</div>
        <div class="col-sm">{{ game.winnerScore }}</div>
        <div class="col-sm">{{ game.loserId }}</div>
        <div class="col-sm">{{ game.loserScore }}</div>
        <hr />
      </div>
    </div>
  </div>
  </template>
  
  <script setup lang="ts">
  import axios from "axios";
  import { ref, onMounted } from "vue";
  
  const games = ref([]);
  
  onMounted(() => {
    getGames();
  });
  
  async function getGames() {
    const res = await axios("http://localhost:3000/game/");
    games.value = res.data;
  }
  </script>