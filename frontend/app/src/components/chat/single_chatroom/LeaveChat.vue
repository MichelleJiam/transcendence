<template>
  <section>
    <button @click="leaveChatroom()">Leave Chat</button>
  </section>
</template>

<script setup lang="ts">
import apiRequest, { baseUrl, frontendUrl } from "@/utils/apiRequest";
import { io } from "socket.io-client";

const props = defineProps({
  currentUserId: { type: Number, required: true },
  chatroomId: { type: Number, required: true },
});

const socketUrl = baseUrl + "/penalty";
const socket = io(socketUrl);

const backendUrl =
  "/chat/" + props.chatroomId + "/user/" + props.currentUserId + "/leave";

async function leaveChatroom() {
  await apiRequest(backendUrl, "delete").then((response) => {
    console.log(response);
    socket.emit("newUserState", props.chatroomId);
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
