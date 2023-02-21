<template>
  <form @keyup.enter="createChat()" @submit.prevent="createChat">
    <div>
      <h3>Create a chat</h3>
      <label for="type"
        ><span class="formText">Choose a chat type:</span></label
      >
      <select id="type" v-model="chatType" name="type" class="inputStyle">
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
        v-model="chatName"
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
        v-model="chatPassword"
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
import { PostChatDto } from "../chatUtils";
import { ref } from "vue";

const userStore = useUserStore();
const chatName = ref<string>("");
const chatPassword = ref<string>();
const chatType = ref<string>("public");

const postChatData = new PostChatDto();
postChatData.user = userStore.user.id;

// const postChatData = {
//   type: String("public"),
//   chatroomName: String("test name here"),
//   password: String("password here"),
//   user: Number(userStore.user.id),
//   otherUser: Number,
// };

function createChat() {
  if (!chatName.value == null || chatName.value.trim() === "") {
    console.log("Chat must be named");
    alert("Chat must be named");
    return;
  } else {
    postChatData.chatroomName = chatName.value;
    postChatData.type = chatType.value;
    postChatData.password = chatPassword.value;
    apiRequest("/chat/create", "post", { data: postChatData })
      .then((response) => {
        location.reload();
        console.log(response);
      }) // axios throws errors for non 2xx responses by default!
      .catch((error) => {
        console.log(error);
      });
    chatName.value = "default chat name";
    chatPassword.value = "";
  }
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
