<!--
    this should be the main page layout
    so the basic nav bar and the content div
    then there should be different components that render
    on different circumstances
-->

<template>
  <main>
    <div id="display-content">
      <h1>HIGHSCORES</h1>
      <div class="box-styling">
        <ul class="leaderboard list-elements">
          <li class="titles">
            <div class="rank">rank</div>
            <div class="playername">player</div>
            <div class="rate">rate</div>
            <div class="wins">wins</div>
            <div class="losses">losses</div>
          </li>
          <li
            v-for="(rank, index) in leaderboard"
            :key="index"
            class="list-items"
          >
            <div class="rank">{{ inc(index) }}</div>
            <!-- add ranking system-->
            <div class="playername">
              <a :href="'/player/' + rank.user.playerName">{{
                rank.user.playerName
              }}</a>
            </div>
            <div class="rate">{{ rank.rate }}</div>
            <div class="wins">{{ rank.wins }}</div>
            <div class="losses">{{ rank.losses }}</div>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import apiRequest from "@/utils/apiRequest";
import { ref, onBeforeMount } from "vue";

const leaderboard = ref([]);

function inc(index: number) {
  return (index += 1);
}

onBeforeMount(async () => {
  await apiRequest("/leaderboard", "get")
    .then((response) => {
      leaderboard.value = response.data;
    })
    .catch((error) => console.log(error));
});
// const leaderboardDummy = [
//   { rank: 1, playername: "sanne", rate: 2000, wins: 21, losses: 2 },
//   { rank: 2, playername: "nilo", rate: 1900, wins: 12, losses: 3 },
//   { rank: 3, playername: "swaan", rate: 1700, wins: 10, losses: 2 },
//   { rank: 4, playername: "michelle", rate: 1000, wins: 19, losses: 8 },
//   { rank: 5, playername: "niks", rate: 200, wins: 0, losses: 5 },
// ];

// query all game data from the users
// need to have there rate (score) based on that we will order them (rank)
// we will also need there playername
// the amount of wins they have
// amount of losses they have
</script>
<style scoped>
a:link {
  text-decoration: none;
}
h1 {
  font-size: 4.5em;
  padding-bottom: 20px;
}
.box-styling {
  /* border: 2px solid pink; */
  font-family: var(--arcade-font);
}

.titles {
  font-size: 26px;
  color: var(--primary-color);
}

.list-items {
  font-size: 22px;
}

.list-elements > li {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
</style>
