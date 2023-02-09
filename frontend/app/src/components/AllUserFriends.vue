<template>
  <h1>TEST</h1>

  <div v-for="user in users" :key="user.id">
    {{ user }}
    <div v-if="showImg">
      <input type="image" :src="addFriendBtn" />
    </div>
    <hr />
  </div>
</template>

<script setup lang="ts">
import apiRequest from "@/utils/apiRequest";
import { onMounted, ref } from "vue";

const addFriendBtn = new URL("../assets/addFriend.svg", import.meta.url).href;

let showImg = false;
let imgUrl = null;

const users = ref(Array<User>());

type User = {
  id: number;
  playerName: string;
  status: string /* ONLINE | OFFLINE | GAME */;
};

onMounted(async () => {
  const img = new Image();
  img.onload = () => {
    imgUrl = img.src;
    showImg = true;
  };

  img.src = addFriendBtn;
  await updateUserList();
});

async function updateUserList() {
  const res = await apiRequest("/friend/relation/users", "get");
  users.value = res.data;
}
</script>
