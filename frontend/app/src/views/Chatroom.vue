<template>
  <main>
    <div id="display-content">
      <h1>Chatrooms</h1>
      <h3>
        <GetChatrooms></GetChatrooms>
      </h3>
      <h2>Create a chat</h2>
      <MakeChatroom></MakeChatroom>
    </div>
  </main>
</template>

<script lang="ts">
import GetChatrooms from "@/components/chat/GetChatrooms.vue";
import MakeChatroom from "@/components/chat/MakeChatroom.vue";

export default {
  components: { GetChatrooms, MakeChatroom },
};
</script>
<style scoped>
h1 {
  font-size: 10rem;
}
</style>
