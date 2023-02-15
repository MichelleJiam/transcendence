<template>
  <!-- <nav v-if="useUserStore().authenticated"> -->
  <nav v-if="isAuthenticated()">
    <NavBar />
  </nav>
  <RouterView />
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import { useUserStore } from "@/stores/UserStore";

const userStore = useUserStore();

function isAuthenticated() {
  console.log("[DEBUG] App.vue NavBar display check");
  return userStore.isAuthenticated();
}
</script>
