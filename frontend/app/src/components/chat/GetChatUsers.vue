<template>
  <h2>Owner of the chat</h2>
  {{ ownerName }}
  <h2>Admins of the chat</h2>
  <div v-for="admin in chatRoomInfo.admin" :key="chatRoomInfo.admin.id">
    <p style="padding: 2px">
      <b>{{ admin.playerName }}</b>
    </p>
  </div>
  <h2>Members of the chat</h2>
  <div v-for="member in chatRoomInfo.member" :key="chatRoomInfo.member.id">
    <p style="padding: 2px">
      <b>{{ member.playerName }}</b>
      <button @click="createPenalty(userId, member.id, mute, chatRoomInfo.id)">
        mute
      </button>
      <button @click="createPenalty(userId, member.id, ban, chatRoomInfo.id)">
        ban
      </button>
      <button @click="createBlock(userId, member.id)">block</button>make admin,
      make owner
    </p>
  </div>
</template>

<script setup lang="ts">
import apiRequest from "@/utils/apiRequest";
import { createPenalty, createBlock } from "./penalty/createPenalty";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const userId = 2; // replace this with the user Id in the cookie

const mute = "mute";
const ban = "ban";

const route = useRoute();
const chatroomId = route.params.id;
const backendurlChatName = "/chat/" + chatroomId;

let ownerName: string;
const chatRoomInfo = ref([]);

onMounted(() => {
  apiRequest(backendurlChatName, "get").then((response) => {
    chatRoomInfo.value = response.data; // returns the response data into the users variable which can then be used in the template
    ownerName = response.data.owner.playerName;
  });
});
</script>
