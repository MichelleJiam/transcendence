<template>
  <form @submit.prevent="createChat">
    <div>
      <h3>Create a chat</h3>
      <label for="type"
        ><span class="formText">Choose a chat type:</span></label
      >
      <select
        id="type"
        v-model="postChatData.type"
        name="type"
        class="inputStyle"
      >
        <option value="public" selected>public</option>
        <option value="private">private</option>
        <option value="password">password</option>
      </select>
    </div>
    <div>
      <label for="chatroomName"
        ><span class="formText">Name the chat:</span></label
      >
      <br />
      <input
        id="chatroomName"
        v-model="postChatData.chatroomName"
        type="text"
        class="inputStyle"
        required
      />
    </div>

    <div>
      <label for="password"><span class="formText">Password:</span></label>
      <br />
      <input
        id="password"
        v-model="postChatData.password"
        type="text"
        class="inputStyle"
      />
    </div>
    <button class="buttonStyle">Create chat</button>
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
<style scoped>
.formText {
  font-size: 1rem;
}

.inputStyle {
  width: 25%;
  height: 10%;
  font-size: 0.8rem;
  margin: 1% 1%;
}

.buttonStyle {
  height: 3rem;
  margin: 1% 1%;
}
</style>
