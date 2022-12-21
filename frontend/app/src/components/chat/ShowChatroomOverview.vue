<template>
  <div v-for="chatroom in chatrooms" :key="chatroom.id">
    <div v-if="chatroom.type === 'public' || chatroom.type === 'password'">
      <p>
        {{ chatroom.id }} {{ chatroom.chatroomName }} type:
        {{ chatroom.type }}
      </p>
    </div>
    <!-- <div v-if="message.userId">
	  <p><pre> <b>{{ message.userId.username }}</b> <i style="font-size: 12px;">Posted at: {{ message.created_at }}</i></pre></p>
	  <pre><p>  {{ message.body }}</p></pre>
	<p v-if="message.chatroomId">Chatroom id: {{ message.chatroomId.chatroomId }}</p>
	  <hr/>
	  </div> -->
    <!-- if there are squiggly lines, they don't actually mean it's broken for some reason it can't resolve that the user IS being called -->
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      chatrooms: [], // using defineComponent this can be used to retrieve the user table from the backend using the axio.get
    };
  },
  mounted() {
    axios.get("http://localhost:3000/chat").then((response) => {
      this.chatrooms = response.data; // returns the response data into the users variable which can then be used in the template
    });
  },
});
</script>
