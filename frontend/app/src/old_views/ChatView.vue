<template>
  <div class="container">
    <h1 class="pt-3 pb-3">Chat</h1>
    <PostMessages />
    <GetMessages />
  </div>
</template>

<script lang="ts">
import GetMessages from "@/components/chat/GetMessages.vue";
import PostMessages from "@/components/chat/PostMessages.vue";
export default {
  components: {
    GetMessages,
    PostMessages,
  },
};
// creates a view that displays a way to send chat messages AND view them
</script>
