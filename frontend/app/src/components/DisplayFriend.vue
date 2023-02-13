<template>
  <div class="container">
    <h3>Friends</h3>
    <ul class="list-group">
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
        <span>{{ friend.playerName }}</span>
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
  margin-top: 20px;
  width: 50%;
  max-height: 505px;
  min-height: 505px;
  overflow-y: scroll;
  box-shadow: rgba(0, 0, 0, 10) 0px 1px 4px;
}

.container h3 {
  margin: 20px;
}

.list-group {
  list-style: none;
}

.list-group li {
  padding: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 95px;
  background-color: #3d2c2c;
  margin: 10px 30px 10px 10px;
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

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: #39ff14;
}
</style>
