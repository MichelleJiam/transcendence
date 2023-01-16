<!--
    this should be the main page layout
    so the basic nav bar and the content div
    then there should be different components that render
    on different circumstances
-->

<template>
  <main>
    <div id="display-content">
      <h1>MAIN VIEW</h1>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { onMounted } from "vue";

const userStore = useUserStore();

onMounted(async () => {
  await userStore.checkUserAuthStatus();
  console.log("MainView.onMounted auth: ", userStore.isAuthenticated); // doesn't work, stays false
});
</script>

<style scoped>
h1 {
  font-size: 10rem;
}
</style>
