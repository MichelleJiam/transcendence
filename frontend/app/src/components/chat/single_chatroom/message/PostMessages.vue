<template>
  <section>
    <div>
      <form @keyup.enter="sendMessage()" @submit.prevent="sendMessage()">
        <input
          id="body"
          v-model="messageBody"
          type="text"
          class="space"
          required
        />
        <button>Post Message</button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { baseUrl } from "@/utils/apiRequest";
import { io } from "socket.io-client";
import { ref } from "vue";
import { SendMessageDto } from "../../chatUtils";

const props = defineProps({
  currentUserId: { type: Number, required: true },
  chatroomId: { type: Number, required: true },
});

const socketUrl = baseUrl + "/chat";
const socket = io(socketUrl);

const messageBody = ref<string>();

const sendMessageDto = new SendMessageDto();
sendMessageDto.userId = Number(props.currentUserId);
sendMessageDto.chatroomId = Number(props.chatroomId);

function sendMessage() {
  if (messageBody.value) {
    sendMessageDto.body = messageBody.value;
    socket.emit("sendMessage", sendMessageDto);
    messageBody.value = "";
  }
}
</script>
<style scoped>
.space {
  margin-right: 2rem;
}
</style>
