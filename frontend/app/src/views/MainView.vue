<template>
  <main>
    <PlayernamePopup
      v-show="showPopup"
      class="playername-popup"
    ></PlayernamePopup>
    <div id="display-content" class="main-container">
      <h1 class="username">{{ userStore.user.playerName }}</h1>
      <WinsLosses class="wins-losses"></WinsLosses>
      <GameHistory class="game-history"></GameHistory>
      <UserAchiements class="user-achievements"></UserAchiements>
    </div>
  </main>
  <div :class="{overlay: showPopup}"></div>
</template>

<script setup lang="ts">
import PlayernamePopup from "@/components/PlayernamePopup.vue";
import WinsLosses from "@/components/WinsLosses.vue";
import GameHistory from "@/components/GameHistory.vue"
import UserAchiements from "@/components/UserAchiements.vue"
import { onMounted, computed } from "vue";
import { useUserStore } from "@/stores/UserStore";

const userStore = useUserStore();

const showPopup = computed (() => {
  return userStore.user.playerName == null;
})

onMounted(async () => {
  await userStore.retrieveCurrentUserData();
});
</script>

<style scoped>

.main-container {
  display: grid;
  gap: 20px;
  justify-items: center;
	align-items: center;
  grid-template: 
    "username username username"
    "stats gamehistory achievements";
}
/* .main-container > * {
  border: 10px solid white;
} */
.username {
  grid-area: username;
}
.wins-losses {
  grid-area: stats;
}
.game-history {
  grid-area: gamehistory;
}
.user-achievements {
  grid-area: achievements;
}

h1 {
  font-size: 10rem;
  color: white;
}

/* CSS for the playername pop up */
.playername-popup {
  position: absolute;
  z-index: 2;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  /* background-color: pink; */
  z-index: 1;
  width: 100%;
  height: 100%;
  /* display: none; */
}

</style>
