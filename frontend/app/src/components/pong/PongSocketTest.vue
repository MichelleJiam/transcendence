<template>
  <div v-if="!joined">
    <button class="btn" @click="joinGame">PLAY</button>
    <button class="btn">WATCH</button>
  </div>
</template>

<script setup lang="ts">
import { io } from "socket.io-client";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const id = route.params.id;
const socket = io("http://localhost:3000");
const joined = ref(false);
const name = ref("");

onBeforeMount(() => {
  socket.on("connect", () => {
    console.log(socket.id + " connected from frontend"); // x8WIv7-mJelg7on_ALbx
  });

  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected from frontend");
  });

  // socket.emit("findAllMessages", {}, (response: []) => {
  //   messages.value = response;
  // });

  // socket.on("message", (message) => {
  //   messages.value.push(message);
  // }
});

const joinGame = () => {
  socket.emit("join", { id: id }, () => {
    joined.value = true;
  });
};
</script>

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
