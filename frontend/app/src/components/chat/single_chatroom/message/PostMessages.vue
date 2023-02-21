<template>
  <section>
    <div>
      <form @keyup.enter="sendMessage()" @submit.prevent="sendMessage()">
        <input id="body" v-model="messageBody" type="text" required />
        <button>Post Message</button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { baseUrl } from "@/utils/apiRequest";
import { io } from "socket.io-client";
import { useRoute } from "vue-router";
import { ref } from "vue";
import { SendMessageDto } from "../../chatUtils";

const socketUrl = baseUrl;
const route = useRoute();
const chatroomId = route.params.id;
const userStore = useUserStore();
const socket = io(socketUrl);

const messageBody = ref<string>();

const sendMessageDto = new SendMessageDto();
sendMessageDto.userId = userStore.user.id;
sendMessageDto.chatroomId = Number(chatroomId);

function sendMessage() {
  if (messageBody.value) {
    sendMessageDto.body = messageBody.value;
    socket.emit("sendMessage", sendMessageDto);
    messageBody.value = "";
  }
}
</script>
