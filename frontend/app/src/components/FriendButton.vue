<template>
  <!-- <button>{{ props.friendId }}</button> -->
  <!-- <button v-else-if="">Pending</button> -->
  <!-- <button v-else>Unfriend</button> -->
  <!-- <button v-if="friend.relation?.status == 'PENDING'" class="pending" disabled>
    Pending
  </button> -->
  <!-- <button
    v-else-if="friend.relation?.status == 'FRIEND'"
    class="unfriend"
    @click="utilsUnfriend(friend, friendStore)"
  >
    Unfriend
  </button> -->
  <button
    v-if="status == 'PENDING'"
    class="pending"
    @click="cancelRequest(friend)"
  >
    Cancel
  </button>
  <button
    v-if="status == 'NONE'"
    @click="sendUtilsFriendRequest(userStore.user.id, friend, friendStore)"
  >
    Add Friend
  </button>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { io } from "socket.io-client";
import { useFriendStore, type User } from "@/stores/FriendStore";
import { useUserStore } from "@/stores/UserStore";
import apiRequest, { baseUrl } from "@/utils/apiRequest";
import { sendUtilsFriendRequest, utilsUnfriend } from "./friend/friendUtils";
const props = defineProps({
  friendId: Number,
});

const friendStore = useFriendStore();
const userStore = useUserStore();
const socket = io(baseUrl + "/friend");

const friend = ref();
const status = ref<string>("NONE");

// inventory.find(e => e.name === 'apples');

onBeforeMount(async () => {
  socket.on("connect", () => {
    console.log(
      socket.id + " user",
      userStore.user.id,
      "connected to socket on player page"
    );
  });

  await apiRequest("/user/" + props.friendId, "get").then((response) => {
    friend.value = response.data;

    const user = friendStore.users.find(
      (buddy) => buddy.id === friend.value.id
    );
    if (user?.relation != undefined) status.value = user?.relation?.status;
    console.log("status: ", status.value);
  });

  socket.on("friendRequest", async (data) => {
    console.log("in friendRequest", data.target);
    if (data.source == userStore.user.id) {
      status.value = "PENDING";
    } else if (data.target == userStore.user.id) {
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
      const user = friendStore.users.find(
        (friend) => friend.id === data.source
      );
      if (user?.relation != undefined) status.value = user?.relation.status;
      await friendStore.updateUserList(userStore.user.id);
    }
  });
});

async function cancelRequest(player: User) {
  const user = friendStore.users.find((friend) => friend.id === player.id);

  if (user) await friendStore.removeRelation(user);
  if (user?.relation != undefined) status.value = user?.relation.status;
  console.log("in cancel request", user);
  // await friendStore.updateUserList(userStore.user.id);
}

async function acceptRequest(player: User) {
  const user = friendStore.users.find((friend) => friend.id === player.id);
  if (user) {
    await friendStore.acceptRequest(player);
    await friendStore.updateUserList(userStore.user.id);
    if (user?.relation != undefined) status.value = user?.relation.status;
  }
}

async function denyRequest(player: User) {
  const user = friendStore.users.find((friend) => friend.id === player.id);
  if (user) {
    await friendStore.removeRelation(player);
    if (user?.relation != undefined) status.value = user?.relation.status;
  }
}
// TODO: import the friend store and implement showing if a friendship
// is pending, not there yet or already established.
// reuse the code used in friendpage
</script>
<style scoped>
.pending {
  background: #ff7200;
}

.pending button:hover,
button:active {
  background: #ff7200;
}

.unfriend {
  background: #ff1818;
}
</style>
