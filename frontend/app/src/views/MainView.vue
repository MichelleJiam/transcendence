<template>
  <main>
    <PlayernamePopup
      v-show="showPopup"
      class="playername-popup"
    ></PlayernamePopup>
    <div id="display-content">
      <h1>MAIN VIEW</h1>
      <h2>player name: {{ userStore.user.playerName }}</h2>
    </div>
  </main>
  <div :class="{overlay: showPopup}"></div>
</template>

<script setup lang="ts">
import PlayernamePopup from "@/components/PlayernamePopup.vue";
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

h1 {
  font-size: 10rem;
}
</style>
