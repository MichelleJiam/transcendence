<template>
  <section>
    <h1>{{ chatRoomInfo.chatroomName }}</h1>
    <div v-for="msg in chatRoom" :key="chatRoom.id">
      <pre><b>{{ msg.userId.playerName }}</b>	<i style="font-size: 12px;">Posted at: {{ msg.createdAt }}</i></pre>
      <p>{{ msg.body }}</p>
      <hr />
    </div>
  </section>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const chatroomId = route.params.id;

const chatRoom = ref([]);
const chatRoomInfo = ref([]);
const backendurlChatName = "http://localhost:3000/chat/" + chatroomId;
const backendurlMessages =
  "http://localhost:3000/chat/" + chatroomId + "/messages";

onMounted(() => {
  axios.get(backendurlMessages).then((response) => {
    console.log(response.data);
    chatRoom.value = response.data; // returns the response data into the users variable which can then be used in the template
  });
  axios.get(backendurlChatName).then((response) => {
    console.log(response.data);
    chatRoomInfo.value = response.data; // returns the response data into the users variable which can then be used in the template
  });
  // needs auth cookie info to know what user i need to grab for
  // axios.get("http://localhost:3000/chat/user/:userId").then((response) => {
  //   userChats.value = response.data;
  // });
});
</script>
