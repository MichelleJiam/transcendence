<template>
  <main>
    <div id="display-content">
      <Suspense>
        <template #default>
          <AllUsersFriend :userid="userStore.user.id" />
        </template>
        <template #fallback><p>loading...</p></template>
      </Suspense>
      <Suspense>
        <template #default>
          <DisplayPending :userid="userStore.user.id" />
        </template>
        <template #fallback><p>loading...</p></template>
      </Suspense>
      <Suspense>
        <template #default>
          <DisplayFriend :userid="userStore.user.id" />
        </template>
        <template #fallback><p>loading...</p></template>
      </Suspense>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { io } from "socket.io-client";
import AllUsersFriend from "@/components/AllUsersFriend.vue";
import DisplayPending from "@/components/DisplayPending.vue";
import DisplayFriend from "@/components/DisplayFriend.vue";
import { useFriendStore } from "@/stores/FriendStore";
import { useUserStore } from "@/stores/UserStore";

const friendStore = useFriendStore();
const userStore = useUserStore();
const socket = io("http://localhost:3000/friend");

onBeforeMount(async () => {
  socket.on("connect", () => {
    console.log(
      socket.id + " user",
      userStore.user.id,
      "connected to socket on FriendPage"
    );
  });
});

/*************************
 * socket event listeners *
 *************************/

socket.on("friendRequest", async (data) => {
  if (data.target == userStore.user.id) {
    await friendStore.updateUserList(userStore.user.id);
  }
});

socket.on("requestAccepted", async (data) => {
  if (data.source == userStore.user.id) {
    await friendStore.updateUserList(userStore.user.id);
  }
});

socket.on("unfriend", async (data) => {
  if (data.target == userStore.user.id || data.source == userStore.user.id) {
    await friendStore.updateUserList(userStore.user.id);
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
