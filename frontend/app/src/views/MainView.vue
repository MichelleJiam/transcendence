<!--
  TODO: add a x button on the form, if you exit it will log
  you out and bring you back to the login page.
-->

<template>
  <main>
    <PlayernamePopup
      v-show="showPopup"
      class="playername-popup"
    ></PlayernamePopup>
    <div id="display-content">
      <h1>MAIN VIEW</h1>
      <h2>player name: {{ store.accountSettings.playerName }}</h2>
    </div>
  </main>
  <div :class="{overlay: showPopup}"></div>
</template>

<script setup lang="ts">
import { useAccountSettings } from "@/stores/AccountSettings";
import PlayernamePopup from "@/components/PlayernamePopup.vue";
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";

const store = useAccountSettings();
const route = useRoute();
store.setUserId(route.params.id);

const showPopup = computed (() => {
  return store.accountSettings.playerName == null;
})

onMounted(async () => {
  await store.getAccountSettings();
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
