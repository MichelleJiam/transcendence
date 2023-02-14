<template>
  <section>
    <button @click="leaveChatroom()">Leave Chat</button>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import apiRequest, { frontendUrl } from "@/utils/apiRequest";
import { useRoute } from "vue-router";

const route = useRoute();
const chatroomId = route.params.id;

const userStore = useUserStore();
const backendUrl =
  "/chat/" + chatroomId + "/user/" + userStore.user.id + "/leave";

async function leaveChatroom() {
  await apiRequest(backendUrl, "delete").then((response) => {
    window.location.href = frontendUrl + "/chat";
    console.log(response);
  });
}
</script>
