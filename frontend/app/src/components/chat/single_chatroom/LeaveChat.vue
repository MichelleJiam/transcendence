<template>
  <section>
    <button @click="leaveChatroom()">Leave Chat</button>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import apiRequest, { baseUrl, frontendUrl } from "@/utils/apiRequest";
import { io } from "socket.io-client";
import { useRoute } from "vue-router";

const route = useRoute();
const chatroomId = route.params.id;

const socketUrl = baseUrl + "/penalty";
const socket = io(socketUrl);

const userStore = useUserStore();
const backendUrl =
  "/chat/" + chatroomId + "/user/" + userStore.user.id + "/leave";

async function leaveChatroom() {
  await apiRequest(backendUrl, "delete").then((response) => {
    console.log(response);
    socket.emit("newUserState");
    window.location.href = frontendUrl + "/chat";
  });
}
</script>
<style scoped>
button {
  width: 7rem;
  height: 3rem;
  font-size: 1rem;
}
</style>
