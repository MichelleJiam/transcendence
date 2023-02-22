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
import { onMounted } from "vue";

const userStore = useUserStore();

onMounted(async () => {
  console.log("[DEBUG] onMounted");
  await userStore.checkAuthStatus();
  if (userStore.isAuthenticated()) {
    // console.log("User is logged in, registering with frontend store");
    await userStore.logIn();
    await router.push("/home");
  }
});

async function submitLogin(): Promise<void> {
  console.log("[DEBUG] submitLogin");
  window.location.href = `http://localhost:3000/auth/login`;
  // await apiRequest(`/auth/login`, "get")
  //   .then(() => {
  //     console.log("successfully logged in");
  //   })
  //   .catch((err) => {
  //     console.log("error with logging in: ", err);
  //   });
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
