<template>
  <section>
    <form @submit.prevent="createChat">
      <div>
        select type of chat:<br />
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
        <label for="user">userId:</label>
        <input id="user" v-model="postChatData.user" type="number" required />
      </div>
      <div>
        <label for="otherUser">otherUser:</label>
        <input id="otherUser" v-model="postChatData.otherUser" type="number" />
      </div>
      <button>Create chat</button>
    </form>
  </section>
</template>

<script setup lang="ts">
import axios from "axios";

const postChatData = {
  type: String("public"),
  chatroomName: String("test name here"),
  user: Number,
  otherUser: Number,
};

function createChat() {
  if (!postChatData.chatroomName) {
    console.log("Chat must be named");
    throw new TypeError("Chat must be named");
  }
  axios
    .post("http://localhost:3000/chat/create", postChatData)
    .then((response) => {
      console.log(response);
    }) // axios throws errors for non 2xx responses by default!
    .catch((error) => {
      console.log(error);
    });
}
</script>
