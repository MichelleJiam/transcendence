<template>
  <!-- <nav v-if="userStore.authenticated === true"> -->
  <nav v-if="useUserStore().authenticated">
    <!-- <nav v-if="isAuthenticated()"> -->
    <NavBar />
  </nav>
  <RouterView />
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import { useUserStore } from "@/stores/UserStore";

const userStore = useUserStore();

function isAuthenticated() {
  console.log(
    "Checking if user authenticated for displaying navbar: ",
    userStore.authenticated
  );
  return userStore.authenticated;
}
</script>
