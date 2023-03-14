<template>
  <main>
    <form action="#!">
      <h1>Pong</h1>
      <button @click.prevent="submitLogin">Login through 42</button>
    </form>
  </main>
</template>

<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/UserStore";
import { baseUrl } from "@/utils/apiRequest";
import { onMounted } from "vue";

const userStore = useUserStore();

onMounted(async () => {
  await userStore.checkAuthStatus();
  if (userStore.isAuthenticated()) {
    await userStore.logIn();
    await router.push("/");
  }
});

async function submitLogin(): Promise<void> {
  window.location.href = baseUrl + `/auth/login`;
}
</script>

<style scoped>
h1 {
  font-size: 150px;
}

input,
button {
  width: 100%;
  margin-bottom: 1em;
}
</style>
