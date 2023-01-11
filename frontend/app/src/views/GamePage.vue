<script setup lang="ts">
import { onMounted, ref } from "vue";
import PongGame from "../components/pong/PongGame.vue";
import SocketTest from "@/components/pong/SocketTest.vue";
import { useRoute } from "vue-router";
import { apiRequest } from "@/utils/apiRequest";

const route = useRoute();
const id = route.params.id;

// axios call http://localhost:3000/game/${id}/match

const showStartButton = ref(true);
const showWatchButton = ref(true);
const inPlay = ref(false);
const startGame = () => {
  showStartButton.value = false;
  showWatchButton.value = false;
  inPlay.value = true;
};
function updateInPlay(value: boolean) {
  inPlay.value = value;
}

async function testGame() {
  const res = await apiRequest(`/game/${id}/match`, "get");
  console.log(res.data);
}

// onMounted(async () => {
//   const res = await apiRequest(`/game/${id}/match`, "get");
//   console.log(res);
// });
</script>

<template>
  <main>
    <div id="display-content">
      <p>Id: {{ id }}</p>
      <!-- <SocketTest /> -->
      <!-- <PongGame @game-over="updateInPlay" /> -->
      <!-- <div v-if="!inPlay" class="my-btn">
        <button class="btn" @click="startGame">PLAY</button>
        <button class="btn">WATCH</button>
      </div>
      <div v-else>
        <PongGame @game-over="updateInPlay" />
      </div> -->
      <button class="btn" @click="testGame">Play game</button>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
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
}
button:hover {
  color: #39ff14;
}
.my-btn {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
