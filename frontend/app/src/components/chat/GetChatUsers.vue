<template>
  <div class="chat-message-box scroll-y">
    <h2>Owner of the chat</h2>
    <div class="roles">{{ ownerName }} 👑</div>
    <h2>Admins of the chat</h2>
    <div class="roles">
      <div v-for="admin in chatRoomInfo.admin" :key="chatRoomInfo.admin.id">
        <p>
          {{ admin.playerName }}
          <span v-if="admin.isOwner == true">👑</span>
          <br />
          <button
            v-if="
              isUserAdmin == true &&
              admin.isOwner == false &&
              admin.id != userId
            "
            @click="deleteAdmin(chatRoomInfo.id, userId, admin.id)"
          >
            delete admin
          </button>
          <button
            v-if="
              isUserOwner == true &&
              admin.isOwner == false &&
              admin.id != userId
            "
            @click="swapOwner(chatRoomInfo.id, userId, admin.id)"
          >
            make owner
          </button>
        </p>
      </div>
    </div>
    <h2>Members of the chat</h2>
    <div class="roles">
      <div v-for="member in chatRoomInfo.member" :key="chatRoomInfo.member.id">
        <p>
          {{ member.playerName }} <span v-if="member.isOwner == true">👑</span>
          <br />
          <button
            v-if="member.id != userId"
            @click="createBlock(userId, member.id)"
          >
            block
          </button>
          <button
            v-if="
              isUserAdmin == true &&
              member.isOwner == false &&
              member.id != userId
            "
            @click="createPenalty(userId, member.id, mute, chatRoomInfo.id)"
          >
            mute
          </button>
          <button
            v-if="
              isUserAdmin == true &&
              member.isOwner == false &&
              member.id != userId
            "
            @click="createPenalty(userId, member.id, ban, chatRoomInfo.id)"
          >
            ban
          </button>
          <button
            v-if="
              isUserAdmin == true &&
              member.isAdmin == false &&
              member.id != userId
            "
            @click="makeAdmin(chatRoomInfo.id, userId, member.id)"
          >
            make admin
          </button>
        </p>
      </div>
    </div>
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
  isMember,
  AddMemberDto,
} from "./chatUtils";
import { ref, onMounted, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/UserStore";

const userStore = useUserStore();
const userId = userStore.user.id;
const mute = "mute";
const ban = "ban";

const route = useRoute();
const chatroomId = Number(route.params.id);
const backendurlChatName = "/chat/" + chatroomId;

let ownerName: string;
const chatRoomInfo = ref([]);
const isUserOwner = ref();
const isUserAdmin = ref();

onBeforeMount(async () => {
  if ((await isMember(chatroomId, userStore.user.id)) == false) {
    const addMemberUrl = "/chat/" + chatroomId + "/add/member";
    const addMemberDto = new AddMemberDto();
    addMemberDto.member = userStore.user.id;
    await apiRequest(addMemberUrl, "put", { data: addMemberDto });
    location.reload();
  }
});

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
    ownerName =
      response.data.owner.playerName ??
      "unnamedPlayer" + response.data.owner.id;
    for (const member of chatRoomInfo.value.member) {
      member["isOwner"] = await isOwner(chatroomId, member.id);
      member["isAdmin"] = await isAdmin(chatroomId, member.id);
      member.playerName = member.playerName ?? "unnamedPlayer" + member.id;
    }
    for (const admin of chatRoomInfo.value.admin) {
      admin["isOwner"] = await isOwner(chatroomId, admin.id);
      admin["isAdmin"] = await isAdmin(chatroomId, admin.id);
      admin.playerName = admin.playerName ?? "unnamedPlayer" + admin.id;
    }
  });
});
</script>
<style scoped>
button {
  width: 14%;
  height: 2%;
  font-size: 0.7rem;
  padding: 1% 1%;
  margin: 1% 1%;
}

.scroll-y {
  height: 38rem;
  overflow-y: auto;
}

.roles {
  margin: 2% 4%;
}

h2 {
  padding: 2% 1%;
}

p {
  padding: 1% 2%;
}
</style>
