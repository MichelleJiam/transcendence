<template>
  <main>
    <div id="display-content">
      <h1>Friends</h1>
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
import { onMounted } from "vue";
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

onMounted(async () => {
  socket.on("connect", () => {
    console.log(
      socket.id + " user",
      userId,
      "connected to socket on FriendPage"
    );
  });

  await store.updateUserList(userId);
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

<!-- https://softauthor.com/vuejs-composition-api-search-bar-using-computed-properties/ -->
