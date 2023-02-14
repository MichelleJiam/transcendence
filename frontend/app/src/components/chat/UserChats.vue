<template>
  <h2>Chats you're in:</h2>
  <div v-for="userChat in userChats" :key="userChat.id">
    <p>
      <a :href="userChat.linkUrl">{{ userChat.chatroomName }}</a>
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

const userChats = ref([]);
onMounted(() => {
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
<style scoped>
a {
  color: aliceblue;
}
a:hover {
  color: #39ff14;
}
</style>
