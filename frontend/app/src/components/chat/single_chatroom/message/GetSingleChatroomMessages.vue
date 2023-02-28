<template>
  <section>
    <div v-for="msg of messages" :key="messages.id">
      <div v-if="inBlocklist(msg.userId.id) == false" class="chat-message-box">
        <div class="row">
          <div class="playerName">
            <b>{{ msg.userId.playerName }}</b>
          </div>
          <div class="dateTime">
            <i style="font-size: 12px"
              >Posted at: {{ msg.formattedCreatedAt }}</i
            >
          </div>
        </div>
        <div class="row">
          <div class="textBody">
            <p>{{ msg.body }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { apiRequest, baseUrl } from "@/utils/apiRequest";
import { convertDateTime } from "@/utils/dateTime";
import { io } from "socket.io-client";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const socketUrl = baseUrl + "/chat";

const socket = io(socketUrl);

const route = useRoute();
const chatroomId = route.params.id;
const userStore = useUserStore();

const messages = ref([]);
const blocklist = ref([]);
const backendurlMessages =
  "/chat/" + chatroomId + "/user/" + userStore.user.id + "/messages";

const backendBlocklist = "/blocklist/user/" + userStore.user.id;

function inBlocklist(userId: number) {
  for (const entry of blocklist.value) {
    if (entry.blockedUser.id == userId) {
      return true;
    }
  }
  return false;
}

onMounted(async () => {
  await apiRequest(backendurlMessages, "get")
    .then((response) => {
      messages.value = response.data; // returns the response data into the users variable which can then be used in the template
      for (const date of messages.value) {
        const dateTime = new Date(date.createdAt);
        date["formattedCreatedAt"] = convertDateTime(dateTime);
        date.userId.playerName =
          date.userId.playerName ?? "unnamedPlayer" + userStore.user.id;
      }
    })
    .catch((err) => console.error(err));

  await apiRequest(backendBlocklist, "get")
    .then((response) => {
      blocklist.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });

  socket.on("recMessage", (message) => {
    message.userId.playerName =
      message.userId.playerName ?? "unnamedPlayer" + message.userId.id;
    const dateTime = new Date(message.createdAt);
    message["formattedCreatedAt"] = convertDateTime(dateTime);
    messages.value.push(message);
  });
});
</script>
<style scoped>
* {
  box-sizing: border-box;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
  padding: 1%;
}

.playerName {
  float: left;
  width: 24%;
}

.dateTime {
  float: right;
  width: 30%;
}

.textBody {
  text-align: center;
  width: 100%;
}
</style>
