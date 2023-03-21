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
            friend.status === UserStatus.OFFLINE
              ? { 'background-color': 'red' }
              : friend.status === UserStatus.ONLINE
              ? { 'background-color': 'green' }
              : { 'background-color': 'orange' },
          ]"
        ></span>
        <p v-if="friend.status === UserStatus.OFFLINE" class="status-text">
          offline
        </p>
        <p v-else-if="friend.status === UserStatus.ONLINE" class="status-text">
          online
        </p>
        <p v-else class="status-text">in game</p>
        <span class="player-name">
          <a :href="'/player/' + friend.playerName">
            {{ friend.playerName }}
          </a>
        </span>
        <button class="unfriend" @click="unfriend(friend)">Unfriend</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useFriendStore, type User } from "@/stores/FriendStore";

enum UserStatus {
  ONLINE,
  OFFLINE,
  GAME,
}

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
a:link {
  text-decoration: none;
}
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
.status-text {
  display: none;
  position: absolute;
  background-color: grey;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
}

.dot:hover + .status-text {
  display: block;
}
</style>
