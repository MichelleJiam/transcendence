<template>
  <div class="stats-container box-styling">
    <h2>Game History</h2>
    <div class="winner-loser">
      <h3 class="winner-title">WINNER</h3>
      <h3 class="loser-title">LOSER</h3>
    </div>
    <ul class="gamehistory-list list-elements">
      <li v-for="hist in gameHistory" :key="hist.gameid">
        <div class="winner">{{ hist.winner }}</div>
        <div class="loser">{{ hist.loser }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// change this for a call to the back end with all the games
// where is current player has played in this call should return
// an array with all the game objects
// important that they should also be sorted based on the game id
const gameHistory = [
  { gameid: 1, winner: "sanne", loser: "test1" },
  { gameid: 2, winner: "sanne", loser: "test2" },
  { gameid: 3, winner: "test1", loser: "sanne" },
  { gameid: 4, winner: "sanne", loser: "test4" },
  { gameid: 5, winner: "tes", loser: "sanneeee" },
  { gameid: 6, winner: "sanne", loser: "test3" },
  { gameid: 7, winner: "sanne", loser: "test5" },
  { gameid: 8, winner: "sanne", loser: "test1" },
  { gameid: 9, winner: "sanne", loser: "test2" },
  { gameid: 10, winner: "test1", loser: "sanne" },
  { gameid: 11, winner: "sanne", loser: "test4" },
  { gameid: 12, winner: "test2", loser: "sanne" },
  { gameid: 13, winner: "sanne", loser: "test3" },
  { gameid: 14, winner: "sanne", loser: "test5" },
  { gameid: 15, winner: "sanne", loser: "test1" },
  { gameid: 16, winner: "sanne", loser: "test2" },
  { gameid: 17, winner: "test1", loser: "sanne" },
  { gameid: 18, winner: "sanne", loser: "test4" },
  { gameid: 19, winner: "test2", loser: "sanne" },
  { gameid: 20, winner: "sanne", loser: "test3" },
  { gameid: 21, winner: "sanne", loser: "test5" },
  { gameid: 22, winner: "sanne", loser: "test1" },
  { gameid: 23, winner: "sanne", loser: "test2" },
  { gameid: 24, winner: "t1estxz1", loser: "sanne" },
  { gameid: 25, winner: "sanne", loser: "test4" },
  { gameid: 26, winner: "test2", loser: "sanne" },
  { gameid: 27, winner: "sanne", loser: "test3" },
  { gameid: 28, winner: "sanne", loser: "test5" },
];
</script>

<style scoped>
.stats-container {
  display: flex;
  flex-direction: column;
  height: 640px;
  width: 375px;
  padding: 20px;
}
.winner-loser {
  display: flex;
  justify-content: space-between;
  padding: 15px;
}

.winner-title {
  color: var(--primary-color);
}

.loser-title {
  color: var(--loser-color);
}
.gamehistory-list {
  font-family: var(--arcade-font);
  font-size: 1.3rem;
  overflow: scroll;
  overflow-x: hidden;
}

span:first-child {
  padding-right: 10px;
}

h2 {
  font-size: 50px;
}
</style>
