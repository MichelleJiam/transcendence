<template>
  <main>
    <div id="display-content">
      <h2>{{ chatRoomInfo.chatroomName }}</h2>
      <LeaveChat></LeaveChat>
      <div class="row">
        <div class="column">
          <GetSingleChatroomMessages></GetSingleChatroomMessages>
        </div>
        <div class="column">
          <GetChatUsers></GetChatUsers>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import GetChatUsers from "@/components/chat/GetChatUsers.vue";
import GetSingleChatroomMessages from "@/components/chat/GetSingleChatroomMessages.vue";
import LeaveChat from "@/components/chat/LeaveChat.vue";
import apiRequest from "@/utils/apiRequest";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const chatroomId = route.params.id;
const chatRoomInfo = ref([]);

const backendurlChatName = "/chat/" + chatroomId;

onMounted(async () => {
  await apiRequest(backendurlChatName, "get").then((response) => {
    chatRoomInfo.value = response.data; // returns the response data into the users variable which can then be used in the template
  });
});
</script>

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
