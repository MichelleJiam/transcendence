<template>
  <div class="stats-container box-styling">
    <h2 id="wins">WINS</h2>
    <h2 id="losses">LOSSES</h2>
    <h3 id="wins-count">{{ wins }}</h3>
    <h3 id="losses-count">{{ losses }}</h3>
  </div>
</template>

<script setup lang="ts">
import apiRequest from "@/utils/apiRequest";
import { ref, onMounted } from "vue";
const props = defineProps({
  userId: Number,
});

const wins = ref<number>(0);
const losses = ref<number>(0);


onMounted(async () => {
  await apiRequest("/leaderboard/" + props.userId, "get")
    .then((response) => {
      if (response.data != "" && response != undefined) {
        if (response.data.wins != undefined) wins.value = response.data.wins;
        if (response.data.losses != undefined)
          losses.value = response.data.losses;
      }
    })
    .catch((error) => console.log(error));
});
</script>

<style scoped>
.stats-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  align-items: center;
  padding: 20px;

  width: 375px;
}

h2 {
  font-size: 50px;
  font-family: var(--arcade-font);
}

#wins {
  color: var(--primary-color);
}

#wins-count {
  font-size: 30px;
  font-family: var(--arcade-font);
  color: var(--primary-color);
}

#losses {
  color: var(--loser-color);
}

#losses-count {
  font-size: 30px;
  font-family: var(--arcade-font);
  color: var(--loser-color);
}
</style>
