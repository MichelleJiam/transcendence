<template>
  <!-- <nav v-if="userStore.authenticated === true"> -->
  <nav v-if="useUserStore().authenticated">
    <NavBar />
  </nav>
  <RouterView />
</template>

<script setup lang="ts">
import NavBar from "./components/NavBar.vue";
import { useUserStore } from "./stores/UserStore";
</script>
