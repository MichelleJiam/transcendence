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
        <label for="admin">userId:</label>
        <input id="admin" v-model="postChatData.admin" type="number" required />
      </div>
      <button>Create chat</button>
    </form>
  </section>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      postChatData: {
        type: "",
        password: "",
        chatroomName: "",
        admin: "",
        member: "",
      },
    };
  },
  methods: {
    createChat() {
      this.postChatData.member = this.postChatData.admin;
      if (this.postChatData.type == "private" && !this.postChatData.password) {
        console.log("Private chat needs password");
        throw new TypeError("Private chat needs password");
      }
      if (!this.postChatData.chatroomName) {
        console.log("Chat must be named");
        throw new TypeError("Chat must be named");
      }
      axios
        .post("http://localhost:3000/chat/create", this.postChatData)
        .then((response) => {
          console.log(response);
          this.$router.go(0); // upon success, the page will refresh and show the updated messages
        }) // axios throws errors for non 2xx responses by default!
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
</script>
