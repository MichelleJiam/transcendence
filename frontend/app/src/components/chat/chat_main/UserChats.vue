<template>
  <h2>Your chats</h2>
  <div class="overflow-y">
    <div v-for="userChat in userChats" :key="userChat.id">
      <div class="chat-message-box main-chat-page-format">
        <p class="chatroom-list">
          <a :href="userChat.linkUrl">{{ userChat.chatroomName }}</a>
          owned by
          {{ userChat.owner.playerName }}
        </p>
      </div>
    </div>
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
h2 {
  font-size: 3rem;
  margin: 1rem;
}

.overflow-y {
  height: 20rem;
  overflow-y: auto;
}
</style>
