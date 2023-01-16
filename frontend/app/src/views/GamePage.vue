<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { apiRequest } from "@/utils/apiRequest";
import PongGame from "../components/pong/PongGame.vue";
import LoaderKnightRider from "@/components/pong/loaders/LoaderKnightRider.vue";
import SocketTest from "@/components/pong/SocketTest.vue";
import PongSocketTest from "@/components/pong/PongSocketTest.vue";

const route = useRoute();
const id = route.params.id;
const showStartButton = ref(true);
const showWatchButton = ref(true);
const waiting = ref(false);
const inPlay = ref(false);

function updateInPlay(value: boolean) {
  inPlay.value = value;
  // api call to update game stats
}

const startGame = async () => {
  const res = await apiRequest(`/game/${id}/match`, "get");
  if (res.data.status === "waiting") {
    waiting.value = true;
    console.log("waiting state ", res.data);
  } else if (res.data.status == "playing") {
    waiting.value = false;
    console.log("playing state ", res.data);
  }
  showStartButton.value = false;
  showWatchButton.value = false;
  inPlay.value = true;
};
</script>

<template>
  <main>
    <div id="display-content">
      <!-- <PongSocketTest /> -->
      <!-- <p>Id: {{ id }}</p> -->
      <div v-if="!inPlay" class="my-btn">
        <button class="btn" @click="startGame">PLAY</button>
        <button class="btn">WATCH</button>
      </div>
      <div v-else-if="waiting">
        <p>
          WAITING&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FOR<br /><br /><br /><br /><br /><br />OPPONENT
        </p>

        <div>
          <LoaderKnightRider />
        </div>
      </div>
      <div v-else>
        <PongGame @game-over="updateInPlay" />
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
}
.my-btn {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
