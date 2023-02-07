<template>
  <div v-for="publicChat in publicChats" :key="publicChat.id">
    <p>
      {{ publicChat.id }} {{ publicChat.chatroomName }} owned by
      {{ publicChat.owner.playerName }}
    </p>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";

const publicChats = ref([]);
// const userChats = ref([]);
onMounted(() => {
  axios.get("http://localhost:3000/chat/type/public").then((response) => {
    console.log(response.data);
    publicChats.value = response.data; // returns the response data into the users variable which can then be used in the template
  });
  // needs auth cookie info to know what user i need to grab for
  // axios.get("http://localhost:3000/chat/user/:userId").then((response) => {
  //   userChats.value = response.data;
  // });
});
</script>
