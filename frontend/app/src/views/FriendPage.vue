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
        <button @click="sendFriendRequest(player)">Add friend</button>
        <!--  -->
        <!-- use computed property to disable button if user id is equal to player id?s -->
        <hr />
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
const searchQuery = ref("");

onMounted(async () => {
  const res = await apiRequest("/user/", "get");
  users.value = res.data;
});

const searchedPlayers = computed(() => {
  return users.value.filter((player) => {
    return (
      player.playerName
        .toUpperCase()
        .toLowerCase()
        .indexOf(searchQuery.value.toLowerCase()) != -1
    );
  });
});

async function sendFriendRequest(player: User) {
  console.log("source = ", userId, " target = ", player.id);
  const res = await apiRequest("/friend/request", "post", {
    data: {
      source: userId,
      target: player.id,
      status: "PENDING",
    },
  });
  console.log(res.data);
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
