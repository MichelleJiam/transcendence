<template>
  <form @submit.prevent="createChat">
    <div>
      <h2>Create a chat</h2>
      <label for="type">Choose a chat type:</label>
      <select id="type" v-model="postChatData.type" name="type">
        <option value="public" selected>public</option>
        <option value="private">private</option>
        <option value="password">password</option>
      </select>
    </div>
    <div>
      <label for="chatroomName">Name the chat:</label>
      <input
        id="chatroomName"
        v-model="postChatData.chatroomName"
        type="text"
        required
      />
    </div>
    <div>
      <label for="password">Password for password chats:</label>
      <input id="password" v-model="postChatData.password" type="text" />
    </div>
    <button>Create chat</button>
  </form>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import apiRequest from "@/utils/apiRequest";

const userStore = useUserStore();

const postChatData = {
  type: String("public"),
  chatroomName: String("test name here"),
  password: String("password here"),
  user: Number(userStore.user.id),
  otherUser: Number,
};

function createChat() {
  if (!postChatData.chatroomName) {
    console.log("Chat must be named");
    throw new TypeError("Chat must be named");
  }
  apiRequest("/chat/create", "post", { data: postChatData })
    .then((response) => {
      location.reload();
      console.log(response);
    }) // axios throws errors for non 2xx responses by default!
    .catch((error) => {
      console.log(error);
    });
}
</script>
