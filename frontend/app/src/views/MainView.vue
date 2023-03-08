<template>
  <main>
    <PlayerNamePopup
      v-show="showPopup"
      class="playername-popup"
    ></PlayerNamePopup>
    <div
      v-if="
        route.params.playerName == undefined ||
        (route.params.playerName != undefined && isOtherPlayer == true)
      "
      id="display-content"
    >
      <div
        v-if="
          route.params.playerName != undefined &&
          route.params.playerName != userStore.user.playerName
        "
        class="username"
      >
        <AvatarDisplay class="avatar" :src="otherPlayerInfo?.avatarUrl" />
        <h1>{{ otherPlayerInfo?.playerName }}</h1>
      </div>
      <div v-else class="username">
        <AvatarDisplay class="avatar" :src="userStore.user.avatarUrl" />
        <h1>{{ userStore.user.playerName }}</h1>
      </div>
      <WinsLosses
        v-if="
          route.params.playerName != undefined &&
          route.params.playerName != userStore.user.playerName
        "
        class="wins-losses"
        :user-id="otherPlayerInfo.id"
      ></WinsLosses>
      <!-- needs a prop to specify which player's wins/losses, this one for other users -->
      <WinsLosses
        v-else
        :user-id="userStore.user.id"
        class="wins-losses"
      ></WinsLosses>
      <!-- needs a prop to specify which player's wins/losses, this one for current user -->
      <GameHistory
        v-if="
          route.params.playerName != undefined &&
          route.params.playerName != userStore.user.playerName
        "
        class="game-history"
      ></GameHistory>
      <!-- needs a prop to specify which player's game history, this one for other users -->
      <GameHistory v-else class="game-history"></GameHistory>
      <!-- needs a prop to specify which player's game history, this one for current user -->
      <UserAchiements
        class="user-achievements"
        :chievs="userStore.achievements"
      ></UserAchiements>
      <div
        v-if="
          route.params.playerName != undefined &&
          route.params.playerName != userStore.user.playerName
        "
        class="homepage-buttons box-styling"
      >
        <FriendButton :friend-id="otherPlayerInfo?.id"></FriendButton>
        <CreateDMButton :other-player="otherPlayerInfo?.id"></CreateDMButton>
      </div>
      <div v-else class="homepage-buttons box-styling paddle-div">
        <font-awesome class="font-awesome" icon="table-tennis-paddle-ball" />
      </div>
    </div>
    <div v-else>User Not Found</div>
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
import { ref, onMounted, onBeforeMount, computed } from "vue";
import { useUserStore } from "@/stores/UserStore";
import CreateDMButton from "@/components/chat/chat_main/CreateDMButton.vue";
import { useRoute } from "vue-router";
import apiRequest from "@/utils/apiRequest";

const userStore = useUserStore();
const route = useRoute();
const otherPlayerInfo = ref();
const isOtherPlayer = ref<boolean>(false);

const showPopup = computed(() => {
  return userStore.user.playerName == null;
});

onBeforeMount(async () => {
  if (route.params.playerName != undefined) {
    if (route.params.playerName != userStore.user.playerName) {
      await apiRequest("/user/player/" + route.params.playerName, "get")
        .then(async (response) => {
          if (response.data != "") {
            otherPlayerInfo.value = response.data;
            if (otherPlayerInfo.value.id != undefined) {
              isOtherPlayer.value = true;
              await apiRequest(
                "/user/" + otherPlayerInfo.value.id + "/avatar",
                "get"
              )
                .then(
                  (response) =>
                    (otherPlayerInfo.value["avatarUrl"] = response.config.url)
                )
                .catch((err) => {
                  isOtherPlayer.value = false;
                  console.error(err);
                });
            }
          }
        })
        .catch((err) => {
          isOtherPlayer.value = false;
          console.error("an error occured: ", err);
        });
    } else isOtherPlayer.value = true;
  }
});

onMounted(async () => {
  // refresh userStore data
  await userStore.retrieveCurrentUserData();
  await userStore.getAvatar();
  await userStore.getAchievements();
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

.paddle-div {
  display: flex;
  align-items: center;
  justify-content: center;
}

.font-awesome {
  font-size: 50px;
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

@media (max-width: 1100px) {
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
</style>
