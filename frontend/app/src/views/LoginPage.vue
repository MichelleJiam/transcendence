<template>
  <main>
    <form action="#!">
      <h1>Pong</h1>
      <button @click.prevent="submitLogin">Login through 42</button>
    </form>
  </main>
</template>

<script setup lang="ts">
import App from "@/App.vue";
import { useUserStore } from "@/stores/UserStore";
import { onMounted, ref } from "vue";
import { useCookies } from "vue3-cookies";
const userStore = useUserStore();
const redirected = ref(false);
const { cookies } = useCookies();
let cookieWatchTimer = 0;

onMounted(async () => {
  console.log("[DEBUG] onMounted");
  // await userStore.checkAuthStatus();
  // if (userStore.isAuthenticated()) {
  //   await userStore.logIn();
  // }
});

async function submitLogin(): Promise<void> {
  console.log("[DEBUG] submitLogin");
  try {
    redirected.value = true;
    window.location.href = `http://localhost:3000/auth/login`;
    cookieWatchTimer = setInterval(() => {
      if (cookies.get("Authentication") !== null) {
        console.log("Auth cookie: ", cookies.get("Authentication"));
        console.log("Auth cookie returned");
        clearInterval(cookieWatchTimer);
        cookieWatchTimer = 0;
        redirected.value = false;
      }
    }, 3000);
    console.log("exited timer loop");
    if (!redirected.value) {
      console.log("Returned from 42 redirect");
    }
  } catch (err) {
    console.log("Error with submitLogin: ", err);
  }
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
