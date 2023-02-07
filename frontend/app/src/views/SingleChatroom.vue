<template>
  <main>
    <div id="display-content">
      <GetSingleChatroom></GetSingleChatroom>
    </div>
  </main>
</template>

<script lang="ts">
import GetSingleChatroom from "@/components/chat/GetSingleChatroom.vue";

export default {
  components: { GetSingleChatroom },
};
</script>
<style scoped>
h1 {
  font-size: 10rem;
}
</style>
