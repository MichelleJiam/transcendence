<template>
  <div class="container">
    <h1 class="pt-3" pb-3>Chatroom overview</h1>
    <MakeChatroom />
    <ChatView />
  </div>
</template>

<script lang="ts">
import MakeChatroom from "@/components/chat/MakeChatroom.vue";
import ChatView from "@/components/chat/ShowChatroomOverview.vue";
export default {
  components: {
    MakeChatroom,
    ChatView,
  },
};
// creates a view that displays a way to send chat messages AND view them
</script>
