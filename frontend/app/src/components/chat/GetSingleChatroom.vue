<template>
  <section>
    <h1>{{ chatRoomInfo.chatroomName }}</h1>
    <div class="row">
      <div class="column">
        <div v-for="msg of messages" :key="messages.id">
          <pre><b>{{ msg.userId.playerName }}</b>	<i style="font-size: 12px;">Posted at: {{ msg.formattedCreatedAt }}</i></pre>
          <p>{{ msg.body }}</p>
          <hr />
        </div>
      </div>
      <div class="column">
        <GetChatUsers></GetChatUsers>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import apiRequest from "@/utils/apiRequest";
import { convertDateTime } from "@/utils/dateTime";
import { ref, onMounted, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import GetChatUsers from "./GetChatUsers.vue";
import { isMember, AddMemberDto } from "./penalty/chatUtils";
const route = useRoute();
const chatroomId = route.params.id;
const userStore = useUserStore();

const messages = ref([]);
const chatRoomInfo = ref([]);

const backendurlChatName = "/chat/" + chatroomId;
const backendurlMessages =
  "/chat/" + chatroomId + "/user/" + userStore.user.id + "/messages";

onMounted(async () => {
  apiRequest(backendurlMessages, "get").then((response) => {
    messages.value = response.data; // returns the response data into the users variable which can then be used in the template
    for (const date of messages.value) {
      const dateTime = new Date(date.createdAt);
      date["formattedCreatedAt"] = convertDateTime(dateTime);
    }
  });
  apiRequest(backendurlChatName, "get").then((response) => {
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
