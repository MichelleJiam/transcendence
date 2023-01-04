<template>
  <nav v-if="navigationGuard.loggedIn === true">
    <NavBar />
  </nav>
  <RouterView />
</template>

<script setup lang="ts">
import NavBar from "./components/NavBar.vue";
import { useNavigationStore } from "./stores/navigation";

const navigationGuard = useNavigationStore();
</script>
