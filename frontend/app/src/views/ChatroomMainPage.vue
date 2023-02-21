<template>
  <main>
    <div id="display-content">
      <div class="row">
        <div class="column">
          <GetPublicChatrooms></GetPublicChatrooms>
        </div>
        <div class="column createChat">
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
import GetPublicChatrooms from "@/components/chat/chat_main/GetPublicChatrooms.vue";
import MakeChatroom from "@/components/chat/chat_main/MakeChatroom.vue";
import UserChats from "@/components/chat/chat_main/UserChats.vue";
</script>
<style scoped>
* {
  box-sizing: border-box;
}

/* Create two equal columns that floats next to each other */
.column {
  float: left;
  width: 70%;
  padding: 10px;
}

.createChat {
  float: right;
  width: 30%;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
</style>
