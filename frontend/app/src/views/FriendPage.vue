<template>
  <main>
    <div id="display-content">
      <h1>
        <span id="username">{{ userStore.user.playerName }}</span
        >'s friendlist
      </h1>
      <div id="friend-boxes">
        <Suspense class="friend-box">
          <template #default>
            <AllUsersFriend :userid="userStore.user.id" />
          </template>
          <template #fallback><p>loading...</p></template>
        </Suspense>
        <Suspense class="friend-box">
          <template #default>
            <DisplayPending :userid="userStore.user.id" />
          </template>
          <template #fallback><p>loading...</p></template>
        </Suspense>
        <Suspense class="friend-box">
          <template #default>
            <DisplayFriend :userid="userStore.user.id" />
          </template>
          <template #fallback><p>loading...</p></template>
        </Suspense>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { io } from "socket.io-client";
import AllUsersFriend from "@/components/friend/AllUsersFriend.vue";
import DisplayPending from "@/components/friend/DisplayPending.vue";
import DisplayFriend from "@/components/friend/DisplayFriend.vue";
import { useFriendStore } from "@/stores/FriendStore";
import { useUserStore } from "@/stores/UserStore";
import { baseUrl } from "@/utils/apiRequest";

const friendStore = useFriendStore();
const userStore = useUserStore();
const socket = io(baseUrl + "/friend");

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
#display-content {
  height: 1000px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

#friend-boxes {
  display: flex;
  gap: 20px;
  overflow-y: scroll;
  align-items: stretch;
  height: 100%;
}

.friend-box {
  border: 2px solid pink;
}

#username {
  color: var(--primary-color);
}

@media (max-width: 1100px) {
  #display-content {
    height: 100%;
  }
  #friend-boxes {
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    min-height: 200px;
  }
  #friend-boxes > * {
    width: 100%;
    height: 33%;
  }
}
</style>
