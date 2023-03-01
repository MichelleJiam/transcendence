<template>
  <main>
    <PlayerNamePopup
      v-show="showPopup"
      class="playername-popup"
    ></PlayerNamePopup>
    <div id="display-content">
      <div class="username">
        <AvatarDisplay class="avatar" :src="userStore.user.avatarUrl" />
        <h1>{{ userStore.user.playerName }}</h1>
      </div>
      <WinsLosses class="wins-losses"></WinsLosses>
      <GameHistory class="game-history"></GameHistory>
      <UserAchiements class="user-achievements"></UserAchiements>
      <!-- add in a vif if its your own page you see padle bords, if
      someone elses page you see the buttons to DM or Add as friend -->
      <div class="homepage-buttons box-styling">
        <FriendButton class="friend-button"></FriendButton>
        <button>dm player</button>
      </div>
    </div>
  </main>
  <div :class="{ overlay: showPopup }"></div>
</template>

<script setup lang="ts">
import PlayerNamePopup from "@/components/PlayerNamePopup.vue";
import WinsLosses from "@/components/WinsLosses.vue";
import GameHistory from "@/components/GameHistory.vue";
import UserAchiements from "@/components/UserAchiements.vue";
import AvatarDisplay from "@/components/AvatarDisplay.vue";
import FriendButton from "@/components/FriendButton.vue";
import { onMounted, computed } from "vue";
import { useUserStore } from "@/stores/UserStore";

const userStore = useUserStore();

const showPopup = computed(() => {
  return userStore.user.playerName == null;
});

onMounted(async () => {
  // refresh userStore data
  await userStore.retrieveCurrentUserData();
  await userStore.getAvatar();
});
</script>

<style scoped>

#display-content {
  width: auto;
  height: auto;
  display: grid;
  gap: 20px;
  justify-items: center;
  align-items: center;
  grid-template:
    "username username"
    "gamehistory buttons"
    "gamehistory stats"
    "gamehistory achievements";
}
.username {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 30px;

  grid-area: username;
  /* justify-self: center; */
  font-size: 8em;
}
.homepage-buttons {
  grid-area: buttons;
	padding: 20px;
	width: 375px;
  display: flex;
  justify-content: space-between;
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
.avatar {
  height: 100px;
  width: 100px;
  border: 5px solid white;
  /* white for offline, green for online, purple for in a game 
  add a hover function on the avatar image to show the status of the color */
}

h1 {
  font-size: 9rem;
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
  z-index: 1;
  width: 100%;
  height: 100%;
}

@media (max-width: 1100px){
  #display-content {
    flex-direction: column;
    overflow-y: scroll;
    width: 700px;
    height: 80%;
    grid-template:
    "username"
    "buttons"
    "stats"
    "gamehistory"
    "achievements";
  }
}