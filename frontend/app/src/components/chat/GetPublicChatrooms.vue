<template>
  <h2>Public chats</h2>
  <div class="overflow-y">
    <div v-for="publicChat in publicChats" :key="publicChat.id">
      <div class="messageBox">
        <p class="chatroom">
          <a :href="publicChat.linkUrl">{{ publicChat.chatroomName }}</a>
          owned by
          {{ publicChat.owner.playerName }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import apiRequest from "@/utils/apiRequest";
import { ref, onMounted } from "vue";
import { frontendUrl } from "@/utils/apiRequest";

const publicChats = ref([]);
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
});
</script>
<style scoped>
h2 {
  font-size: 3rem;
  margin: 1% 0%;
}
.chatroom {
  margin: 1% 0%;
}

.overflow-y {
  height: 20rem;
  overflow-y: auto;
}

.messageBox {
  background-color: #151414e4;
  margin: 1.25% 4%;
  padding: 2% 2%;
  border-radius: 2rem;
}

a {
  color: aliceblue;
}
a:hover {
  color: #39ff14;
}
</style>
