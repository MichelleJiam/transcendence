<template>
  <div class="stats-container box-styling">
    <h2>Game History</h2>
    <div class="winner-loser">
      <h3 class="winner-title">WINNER</h3>
      <h3 class="loser-title">LOSER</h3>
    </div>
    <ul class="gamehistory-list list-elements">
      <li v-for="(win, index) in wins" :key="index">
        <div class="winner" v-text="win"></div>
        <div class="loser" v-text="losses[index]"></div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import apiRequest from "@/utils/apiRequest";
import { onBeforeMount, ref } from "vue";

const props = defineProps({
  userId: Number,
});

const wins = ref<string[]>([]);
const losses = ref<string[]>([]);

onBeforeMount(async () => {
  await apiRequest(`/game/${props.userId}/state`, "get")
    .then(async (res) => {
      for (const game of res.data) {
        try {
          const playerWin = await apiRequest(
            `/user/${game.game_winnerIdId}`,
            "get"
          );
          game.playerOneName = playerWin.data.playerName;
          wins.value.push(game.playerOneName);
          const playerLose = await apiRequest(
            `/user/${game.game_loserIdId}`,
            "get"
          );
          game.playerTwoName = playerLose.data.playerName;
          losses.value.push(game.playerTwoName);
        } catch (err) {
          console.error("Could not retrieve winners & losers: ", err);
        }
      }
    })
    .catch((err) => {
      console.error("Could not retrieve user games: ", err);
    });
});
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
