<template>
  <div v-for="publicChat in publicChats" :key="publicChat.id">
    <p>
      <a :href="chatLinks[publicChat.id - 1]"
        >{{ publicChat.id }} {{ publicChat.chatroomName }}</a
      >
      owned by
      {{ publicChat.owner.playerName }}
    </p>
  </div>
</template>

<script setup lang="ts">
import apiRequest from "@/utils/apiRequest";
import { ref, onMounted } from "vue";
import { frontendUrl } from "@/utils/apiRequest";

const publicChats = ref([]);
const chatLinks: string[] = [];
// const userChats = ref([]);
onMounted(() => {
  apiRequest("/chat/type/public", "get").then((response) => {
    publicChats.value = response.data; // returns the response data into the users variable which can then be used in the template
    for (const link of publicChats.value) {
      const linkUrl = frontendUrl + "/chat/" + link.id;
      chatLinks.push(linkUrl);
    }
  });
  // needs auth cookie info to know what user i need to grab for
  // axios.get("http://localhost:3000/chat/user/:userId").then((response) => {
  //   userChats.value = response.data;
  // });
});
</script>
