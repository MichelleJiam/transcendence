<template>
  <h2>Owner of the chat</h2>
  {{ ownerName }} 👑
  <h2>Admins of the chat</h2>
  <div v-for="admin in chatRoomInfo.admin" :key="chatRoomInfo.admin.id">
    <p style="padding: 2px">
      {{ admin.playerName }}
      <span v-if="admin.isOwner == true">👑</span>
      <br />
      <button
        v-if="
          isUserAdmin == true && admin.isOwner == false && admin.id != userId
        "
        style="margin: 4px 2px"
        @click="deleteAdmin(chatRoomInfo.id, userId, admin.id)"
      >
        delete admin
      </button>
      <button
        v-if="
          isUserOwner == true && admin.isOwner == false && admin.id != userId
        "
        style="margin: 4px 2px"
        @click="swapOwner(chatRoomInfo.id, userId, admin.id)"
      >
        make owner
      </button>
    </p>
  </div>
  <h2>Members of the chat</h2>
  <div v-for="member in chatRoomInfo.member" :key="chatRoomInfo.member.id">
    <p style="padding: 2px">
      {{ member.playerName }} <span v-if="member.isOwner == true">👑</span>
      <br />
      <button
        v-if="member.id != userId"
        style="margin: 4px 2px"
        @click="createBlock(userId, member.id)"
      >
        block
      </button>
      <button
        v-if="
          isUserAdmin == true && member.isOwner == false && member.id != userId
        "
        style="margin: 4px 2px"
        @click="createPenalty(userId, member.id, mute, chatRoomInfo.id)"
      >
        mute
      </button>
      <button
        v-if="
          isUserAdmin == true && member.isOwner == false && member.id != userId
        "
        style="margin: 4px 2px"
        @click="createPenalty(userId, member.id, ban, chatRoomInfo.id)"
      >
        ban
      </button>
      <button
        v-if="
          isUserAdmin == true && member.isAdmin == false && member.id != userId
        "
        style="margin: 4px 2px"
        @click="makeAdmin(chatRoomInfo.id, userId, member.id)"
      >
        make admin
      </button>
    </p>
  </div>
</template>

<script setup lang="ts">
import apiRequest from "@/utils/apiRequest";
import {
  createPenalty,
  createBlock,
  makeAdmin,
  swapOwner,
  isOwner,
  isAdmin,
  deleteAdmin,
} from "./penalty/chatUtils";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const userId = 2; // replace this with the user Id in the cookie
const mute = "mute";
const ban = "ban";

const route = useRoute();
const chatroomId = Number(route.params.id);
const backendurlChatName = "/chat/" + chatroomId;

let ownerName: string;
const chatRoomInfo = ref([]);
const isUserOwner = ref();
const isUserAdmin = ref();

onMounted(async () => {
  const ownerUrl = "/chat/" + chatroomId + "/is_owner/" + userId;
  const adminUrl = "/chat/" + chatroomId + "/is_admin/" + userId;
  await apiRequest(ownerUrl, "get").then((response) => {
    isUserOwner.value = response.data; // returns the response data into the users variable which can then be used in the template
  });
  await apiRequest(adminUrl, "get").then((response) => {
    isUserAdmin.value = response.data; // returns the response data into the users variable which can then be used in the template
  });
  await apiRequest(backendurlChatName, "get").then(async (response) => {
    chatRoomInfo.value = response.data; // returns the response data into the users variable which can then be used in the template
    ownerName = response.data.owner.playerName;
    for (const member of chatRoomInfo.value.member) {
      member["isOwner"] = await isOwner(chatroomId, member.id);
      member["isAdmin"] = await isAdmin(chatroomId, member.id);
    }
    for (const admin of chatRoomInfo.value.admin) {
      admin["isOwner"] = await isOwner(chatroomId, admin.id);
      admin["isAdmin"] = await isAdmin(chatroomId, admin.id);
    }
  });
});
</script>
