<!--
    this should be the main page layout
    so the basic nav bar and the content div
    then there should be different components that render
    on different circumstances
-->

<template>
  <main>
    <div id="display-content">
      <h1>Players</h1>
      <div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search player..."
        />
        <hr />
      </div>
      <!-- class attribute can be added to style element -->
      <div v-for="player in searchedPlayers" :key="player.id">
        {{ player.playerName }}
        <div
          class="dot"
          :style="[
            player.status === 'offline'
              ? { 'background-color': 'red' }
              : player.status === 'online'
              ? { 'background-color': 'green' }
              : { 'background-color': 'orange' },
          ]"
        ></div>
        <!-- if status friend, display unfriend button, if status pending, display pendig button -->
        <button @click="sendFriendRequest(player)">Add friend</button>
        <hr />
      </div>

      <div style="margin-top: 50px">
        <h2>Friend list</h2>
        <p v-if="friendList.length == 0"><i>No friends</i></p>
        <p v-for="friend in friendList" v-else :key="friend.id">
          {{ friend.playerName }}
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import apiRequest from "@/utils/apiRequest";
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const userId = route.params.id; // temporary workaround: remove when user authentication is fixed

type User = {
  id: number;
  playerName: string;
  status: string;
};

const users = ref(Array<User>());
const friendList = ref(Array<User>());
const searchQuery = ref("");

onMounted(async () => {
  const res = await apiRequest("/user/", "get");
  users.value = res.data;
  updateFriendList();
});

/* LEFT OFF HERE, IMPLEMENT THIS FUNCTIONALITY, USED FOR BUTTON DISPLAY */
async function checkFriendshipStatus(player: User) {
  await apiRequest(`/friend/relation/${userId}/${player.id}`, "get");
}

async function updateFriendList() {
  const res = await apiRequest(`/friend/${userId}`, "get");
  friendList.value = res.data;
}

/* called twice, i think when the app is created, how to fix? */
const searchedPlayers = computed(() => {
  return users.value.filter((player) => {
    if (player.playerName && player.id != Number(userId)) {
      return (
        player.playerName
          .toUpperCase()
          .toLowerCase()
          .indexOf(searchQuery.value.toLowerCase()) != -1
      );
    }
  });
});

async function sendFriendRequest(player: User) {
  if (userId) {
    try {
      await apiRequest("/friend/request", "post", {
        data: {
          source: userId,
          target: player.id,
          status: "FRIEND",
        },
      });
    } catch (error) {
      console.log(error);
      return;
    }
    await updateFriendList();
    alert("Friend request send");
  } else console.log("No userId provided in url");
}
</script>

<style scoped>
h1 {
  font-size: 10rem;
}

.dot {
  height: 25px;
  width: 25px;
  border-radius: 50%;
}
</style>

<!-- https://softauthor.com/vuejs-composition-api-search-bar-using-computed-properties/ -->
<!-- display button text based on friendship status? "send friend request" => "pending" -->
