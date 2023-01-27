<!--
    this should be the main page layout
    so the basic nav bar and the content div
    then there should be different components that render
    on different circumstances
-->

<template>
  <main>
    <div id="display-content">
      <div v-if="!inPlay" class="my-btn">
        <button class="btn" @click="startGame">PLAY</button>
        <button class="btn">WATCH</button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import apiRequest from "@/utils/apiRequest";
import { ref } from "vue";
import { useRoute } from "vue-router";

const State = {
  READY: 0,
  PLAYING: 1,
  WAITING: 2,
  DONE: 3,
};

const route = useRoute();
const id = route.params.id;
const showStartButton = ref(true);
const showWatchButton = ref(true);
const gameState = ref(State.READY);

const startGame = async () => {
  const res = await apiRequest(`/match/${id}`, "get");
  if (res.data.id == undefined) {
    gameState.value = State.WAITING;
    console.log("put user in waiting state - show loader!");
  } else {
    gameState.value = State.PLAYING;
    console.log(
      "put this player in a room with the id of the returned game res.data.id"
    );
    showStartButton.value = false;
    showWatchButton.value = false;
  }
};
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

p {
  font-family: "ArcadeClassic", sans-serif;
  font-size: 6vw;
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
  background-color: #1c1b1b;
}
.my-btn {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
