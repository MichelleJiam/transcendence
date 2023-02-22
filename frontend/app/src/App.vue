<template>
  <!-- <nav v-if="useUserStore().authenticated"> -->
  <!-- <nav v-if="authenticated"> -->
  <nav v-if="isAuthenticated()">
    <NavBar />
  </nav>
  <RouterView />
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import { useUserStore } from "@/stores/UserStore";
import { onMounted, ref } from "vue";

const userStore = useUserStore();
// const authenticated = ref(false);

// onMounted(async () => {
//   await isAuthenticated();
// });

// async function isAuthenticated() {
function isAuthenticated() {
  console.log("[DEBUG] App.vue NavBar display check");
  return userStore.isAuthenticated();
  // authenticated.value = await userStore.checkAuthStatus();
}
</script>
