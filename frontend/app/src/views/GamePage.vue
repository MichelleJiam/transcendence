<script setup lang="ts">
import { ref } from "vue";
import Pong from "../components/pong/Pong.vue";

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
</script>

<template>
  <main>
    <div id="display-content">
      <div v-if="!inPlay" class="my-btn">
        <button class="btn" @click="startGame">PLAY</button>
        <button class="btn">WATCH</button>
      </div>
      <div v-else>
        <Pong @game-over="updateInPlay" />
      </div>
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
  color: rgba(15, 15, 217, 0.847);;
}
.my-btn {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
