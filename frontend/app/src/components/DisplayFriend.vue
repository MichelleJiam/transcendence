<template>
  <div class="container box-styling">
    <h3>Friends</h3>
    <ul class="list-elements">
      <p v-if="store.isLoading">Loading...</p>
      <li v-for="friend in friendList" :key="friend.id">
        <span><img :src="friend.avatarUrl" alt="Avatar" class="avatar" /></span>
        <span
          class="dot"
          :style="[
            friend.status === 'offline'
              ? { 'background-color': 'red' }
              : friend.status === 'online'
              ? { 'background-color': 'green' }
              : { 'background-color': 'orange' },
          ]"
        ></span>
        <span class="player-name">{{ friend.playerName }}</span>
        <button class="unfriend" @click="unfriend(friend)">Unfriend</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useFriendStore, type User } from "@/stores/FriendStore";

const store = useFriendStore();

/**********************
 * computed properties *
 **********************/

const friendList = computed(() => {
  return store.users.filter((player) => {
    if (player.relation?.status == "FRIEND") {
      return player.playerName;
    }
  });
});

/********
 * store *
 *********/

async function unfriend(player: User) {
  await store.removeRelation(player);
}
</script>

<style scoped>
.container {
  width: 50%;
  overflow-y: scroll;
}

h3 {
  margin-top: 20px;
}
.player-name {
  font-size: 18px;
  font-family: var(--arcade-font);
}
.avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.unfriend {
  background: #ff1818;
}

.pending {
  background: orange;
}

button {
  padding: 3px;
  font-size: 18px;
}
.pending button:hover,
button:active {
  background: #ff1818;
}
.dot {
  height: 25px;
  width: 25px;
  border-radius: 50%;
}

:disabled {
  cursor: progress;
}
</style>
