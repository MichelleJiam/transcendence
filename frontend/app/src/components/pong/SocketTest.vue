<template>
  <div id="chat">
    <div v-if="!joined">
      <form @submit.prevent="join">
        <label>Whats your name?</label>
        <input v-model="name" />
        <button type="submit">Send</button>
      </form>
    </div>
    <div v-else class="chat-container">
      <div class="messages-container">
        <div v-for="message in messages" :key="message.name">
          [{{ message.name }}]: {{ message.text }}
        </div>
      </div>

      <div v-if="typingDisplay">{{ typingDisplay }}</div>

      <div class="message-input">
        <form @submit.prevent="sendMessage">
          <label>Message</label>
          <input v-model="messageText" @input="emitTyping" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { io } from "socket.io-client";
import { onBeforeMount, ref } from "vue";

const socket = io("http://localhost:3000");

const messages = ref<Array<{ name: string; text: string }>>([]);
const messageText = ref("");
const joined = ref(false);
const name = ref("");
const typingDisplay = ref("");

onBeforeMount(() => {
  socket.on("connect", () => {
    console.log(socket.id + " connected from frontend"); // x8WIv7-mJelg7on_ALbx
  });

  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected from frontend");
  });

  socket.emit("findAllMessages", {}, (response: []) => {
    messages.value = response;
  });

  socket.on("message", (message) => {
    messages.value.push(message);
  });

  socket.on("typing", ({ name, isTyping }) => {
    if (isTyping) {
      typingDisplay.value = `${name} is typing...`;
    } else {
      typingDisplay.value = "";
    }
  });
});

const sendMessage = () => {
  socket.emit(
    "createMessage",
    { text: messageText.value },
    (response: string) => {
      messageText.value = "";
    }
  );
};

const join = () => {
  socket.emit("join", { name: name.value }, () => {
    joined.value = true;
  });
};

let timeout;
const emitTyping = () => {
  socket.emit("typing", { isTyping: true });
  timeout = setTimeout(() => {
    // as user keeps typing timeout gets updated
    socket.emit("typing", { isTyping: false });
  }, 2000);
};

// console.log(socket);
// socket.emit("findAllMessages", { name: "Hello" }, (data: any) =>
//   console.log(data)
// );
</script>

<style>
.messages-container {
  color: white;
}

.chat {
  padding: 20px;
  height: 100vh;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-container {
  flex: 1;
}
</style>
