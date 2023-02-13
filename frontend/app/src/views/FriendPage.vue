<template>
  <main>
    <div id="display-content">
      <Suspense>
        <template #default> <AllUsersFriend :userid="userId" /> </template>
        <template #fallback><p>loading...</p></template>
      </Suspense>
      <Suspense>
        <template #default> <DisplayPending :userid="userId" /> </template>
        <template #fallback><p>loading...</p></template>
      </Suspense>
      <Suspense>
        <template #default> <DisplayFriend :userid="userId" /> </template>
        <template #fallback><p>loading...</p></template>
      </Suspense>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";
import AllUsersFriend from "@/components/AllUsersFriend.vue";
import DisplayPending from "@/components/DisplayPending.vue";
import DisplayFriend from "@/components/DisplayFriend.vue";
import { useFriendStore } from "@/stores/FriendStore";

const store = useFriendStore();
const socket = io("http://localhost:3000/friend");
const route = useRoute();
const userId = route.params.id as string;

onBeforeMount(async () => {
  socket.on("connect", () => {
    console.log(
      socket.id + " user",
      userId,
      "connected to socket on FriendPage"
    );
  });
});

/*************************
 * socket event listeners *
 *************************/

socket.on("friendRequest", async (data) => {
  if (data.target == userId) {
    await store.updateUserList(userId);
  }
});

socket.on("requestAccepted", async (data) => {
  if (data.source == userId) {
    await store.updateUserList(userId);
  }
});

socket.on("unfriend", async (data) => {
  if (data.target == userId || data.source == userId) {
    await store.updateUserList(userId);
  }
});
</script>

<style scoped>
h1 {
  margin-bottom: 50px;
}

button:disabled,
button[disabled] {
  background-color: #ffa500;
  cursor: not-allowed;
}
</style>
