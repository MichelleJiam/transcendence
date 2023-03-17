<template>
  <form @submit.prevent="createChat()">
    <div>
      <h3>Create a chat</h3>
      <label for="type"
        ><span class="formText">Choose a chat type:</span></label
      >
      <br />
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
const chatPassword = ref<string>("");
const chatType = ref<string>("public");

const postChatData = new PostChatDto();
postChatData.user = userStore.user.id;

async function createChat() {
  if (!chatName.value == null || chatName.value.trim() === "") {
    console.log("Chat must be named");
    alert("Chat must be named");
    return;
  } else if (
    chatType.value == "password" &&
    (!chatPassword?.value == undefined || chatPassword?.value.trim() === "")
  ) {
    console.log("Password required for password chat");
    alert("Password required for password chat");
    return;
  }
  if (chatName.value.length > 25) {
    alert("Chat name too long!");
    chatName.value = "";
    return;
  } else {
    postChatData.chatroomName = chatName.value;
    postChatData.type = chatType.value;
    postChatData.password = chatPassword.value;
    await apiRequest("/chat/create", "post", { data: postChatData })
      .then((response) => {
        location.reload();
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
    chatName.value = "";
    chatPassword.value = "";
  }
}
</script>
<style scoped>
* {
  word-spacing: 0.2rem;
}
.formText {
  font-size: 1rem;
}

.inputStyle {
  width: 15rem;
  height: 10%;
  font-size: 0.8rem;
  margin: 1% 1%;
}

.buttonStyle {
  height: 3rem;
  margin: 1% 1%;
}
</style>
