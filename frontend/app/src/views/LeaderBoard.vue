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
