<template>
  <section>
    <div v-for="msg of messages" :key="messages.id">
      <div v-if="inBlocklist(msg.userId.id) == false" class="chat-message-box">
        <div class="row">
          <div class="playerName">
            <button
              class="playerNameUrl"
              @click="buildUserPageUrl(msg.userId.id)"
            >
              <b>{{ msg.userId.playerName }}</b>
            </button>
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
import { apiRequest, baseUrl } from "@/utils/apiRequest";
import { convertDateTime } from "@/utils/dateTime";
import { io } from "socket.io-client";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { buildUserPageUrl } from "../../chatUtils";

const props = defineProps({
  currentUserId: { type: Number, required: true },
  chatroomId: { type: Number, required: true },
});

const socketUrl = baseUrl + "/chat";

const socket = io(socketUrl);

const messages = ref([]);
const blocklist = ref([]);
const backendurlMessages =
  "/chat/" + props.chatroomId + "/user/" + props.currentUserId + "/messages";

const backendBlocklist = "/blocklist/user/" + props.currentUserId;

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
      messages.value = response.data;
      for (const date of messages.value) {
        const dateTime = new Date(date.createdAt);
        date["formattedCreatedAt"] = convertDateTime(dateTime);
        date.userId.playerName =
          date.userId.playerName ?? "unnamedPlayer" + props.currentUserId;
      }
    })
    .catch((err) => console.error(err));

  await apiRequest(backendBlocklist, "get")
    .then((response) => {
      blocklist.value = response.data;
    })
    .catch((err) => {
      console.error(err);
    });

  socket.on("recMessage", (message) => {
    if (message.chatroomId.id == props.chatroomId) {
      message.userId.playerName =
        message.userId.playerName ?? "unnamedPlayer" + message.userId.id;
      const dateTime = new Date(message.createdAt);
      message["formattedCreatedAt"] = convertDateTime(dateTime);
      messages.value.push(message);
    }
  });
});
</script>
<style scoped>
* {
  box-sizing: border-box;
}

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
