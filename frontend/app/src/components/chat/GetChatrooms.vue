<template>
  <h2>Public chats</h2>
  <div v-for="publicChat in publicChats" :key="publicChat.id">
    <p>
      <a :href="publicChat.linkUrl"
        >{{ publicChat.id }} {{ publicChat.chatroomName }}</a
      >
      owned by
      {{ publicChat.owner.playerName }}
    </p>
  </div>
  <h2>Chats you're in:</h2>
  <div v-for="userChat in userChats" :key="userChat.id">
    <p>
      <a :href="userChat.linkUrl"
        >{{ userChat.id }} {{ userChat.chatroomName }}</a
      >
      owned by
      {{ userChat.owner.playerName }}
    </p>
  </div>
</template>

<script setup lang="ts">
import apiRequest from "@/utils/apiRequest";
import { ref, onMounted } from "vue";
import { frontendUrl } from "@/utils/apiRequest";
import { useUserStore } from "@/stores/UserStore";

const userStore = useUserStore();
const memberOfUrl = "/chat/user/" + userStore.user.id;

const publicChats = ref([]);
const userChats = ref([]);
onMounted(() => {
  apiRequest("/chat/type/public", "get").then((response) => {
    publicChats.value = response.data; // returns the response data into the users variable which can then be used in the template
    for (const link of publicChats.value) {
      const linkUrl = frontendUrl + "/chat/" + link.id;
      link["linkUrl"] = linkUrl;
      link.owner.playerName =
        link.owner.playerName ?? "namelessPlayer" + link.owner.id;
    }
  });
  apiRequest(memberOfUrl, "get").then((response) => {
    userChats.value = response.data;
    for (const link of userChats.value) {
      const linkUrl = frontendUrl + "/chat/" + link.id;
      link["linkUrl"] = linkUrl;
      link.owner.playerName =
        link.owner.playerName ?? "namelessPlayer" + link.owner.id;
    }
  });
});
</script>
