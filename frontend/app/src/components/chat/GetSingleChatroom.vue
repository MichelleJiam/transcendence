<template>
  <section>
    <h1>{{ chatRoomInfo.chatroomName }}</h1>
    <div v-for="msg in chatRoom" :key="chatRoom.id">
      <pre><b>{{ msg.userId.playerName }}</b>	<i style="font-size: 12px;">Posted at: {{ createdAtDates[msg.id - 1] }}</i></pre>
      <p>{{ msg.body }}</p>
      <hr />
    </div>
  </section>
</template>

<script setup lang="ts">
import apiRequest from "@/utils/apiRequest";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const chatroomId = route.params.id;

const chatRoom = ref([]);
const chatRoomInfo = ref([]);
const backendurlChatName = "/chat/" + chatroomId;
const backendurlMessages = "/chat/" + chatroomId + "/messages";

const createdAtDates: string[] = [];

onMounted(() => {
  apiRequest(backendurlMessages, "get").then((response) => {
    chatRoom.value = response.data; // returns the response data into the users variable which can then be used in the template
    for (const date of chatRoom.value) {
      const dateTime = Date(date.createdAt);
      const text = dateTime.toLocaleString();
      createdAtDates.push(text);
      console.log(text);
    }
  });
  apiRequest(backendurlChatName, "get").then((response) => {
    chatRoomInfo.value = response.data; // returns the response data into the users variable which can then be used in the template
  });
  // needs auth cookie info to know what user i need to grab for
  // axios.get("http://localhost:3000/chat/user/:userId").then((response) => {
  //   userChats.value = response.data;
  // });
});
</script>
