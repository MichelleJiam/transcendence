<!--
    this should be the main page layout
    so the basic nav bar and the content div
    then there should be different components that render
    on different circumstances
-->

<template>
  <main>
    <PlayernamePopup
      v-show="!store.accountSettings.playerName"
      class="playername-popup"
    ></PlayernamePopup>
    <div id="display-content">
      <!-- <div v-if="store.accountSettings.playerName == null"> -->
      <!-- </div> -->
      <!-- <div v-else> -->
      <h1>MAIN VIEW</h1>
      <h2>player name: {{ store.accountSettings.playerName }}</h2>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAccountSettings } from "@/stores/AccountSettings";
import PlayernamePopup from "@/components/PlayernamePopup.vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const store = useAccountSettings();
const route = useRoute();
store.setUserId(route.params.id);

onMounted(async () => {
  await store.getAccountSettings();
  if (store.accountSettings.playerName == null) {
    alert("PLAYER NAME SHOULD BE SET.");
  }
});
</script>

<style scoped>
.playername-popup {
  position: absolute;
  z-index: 2;
}

h1 {
  font-size: 10rem;
}
</style>
