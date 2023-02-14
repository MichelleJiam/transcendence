<template>
  <main>
    <div id="display-content">
      <div class="row">
        <div class="column">
          <GetPublicChatrooms></GetPublicChatrooms>
        </div>
        <div class="column">
          <MakeChatroom></MakeChatroom>
        </div>
      </div>
      <div class="row">
        <div class="column">
          <UserChats></UserChats>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import GetPublicChatrooms from "@/components/chat/GetPublicChatrooms.vue";
import MakeChatroom from "@/components/chat/MakeChatroom.vue";
import UserChats from "@/components/chat/UserChats.vue";
</script>
<style scoped>
h1 {
  font-size: 10rem;
}
</style>
<style scoped>
* {
  box-sizing: border-box;
}

/* Create two equal columns that floats next to each other */
.column {
  float: left;
  width: 50%;
  padding: 10px;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
</style>
<style scoped>
h1 {
  font-size: 10rem;
}
</style>
