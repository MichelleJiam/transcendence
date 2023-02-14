<!-- <template>
  <main>
    <form action="#!">
      <h1>Pong</h1>

      <div class="input-parent">
        <label for="username">Username</label>
        <input id="username" v-model="username" type="text" />
      </div>

      <div class="input-parent">
        <label for="password">Password</label>
        <input id="password" v-model="password" type="password" />
      </div>

      <button @click.prevent="submitLogin">Login</button>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import router from "../router";
import { useNavigationStore } from "../stores/navigation";

const navigationGuard = useNavigationStore();

const username = ref<string>("");
const password = ref<string>("");
function submitLogin(): void {
  // hardcoded user and passwordt ATM
  if (username.value == "username" && password.value == "password") {
    alert("Correct Login.");
    navigationGuard.loggedIn = true;
    router.push("/");
  } else {
    alert("Invalid Login.");
  }
  // reset login fields to be empty
  username.value = "";
  password.value = "";
}
</script>

<style scoped>
h1 {
  font-size: 150px;
  /* margin-bottom: 10px; */
}

form {
  background: #151414e4;
  text-align: center;
  padding: 20px 28px;
  border: 2px #302d2d solid;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}

input,
button {
  width: 100%;
  margin-bottom: 1em;
}
</style> -->

<template>
  <main>
    <form action="#!">
      <h1>Pong</h1>
      <button @click.prevent="submitLogin">Login through 42</button>
    </form>
  </main>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { onMounted, onUpdated, ref } from "vue";
const userStore = useUserStore();

onMounted(async () => {
  console.log("[DEBUG] onMounted");
  await userStore.checkAuthStatus();
  console.log("Auth status is: ", userStore.isAuthenticated());
  if (userStore.isAuthenticated()) {
    await userStore.logIn();
  }
});

async function submitLogin(): Promise<void> {
  console.log("[DEBUG] submitLogin");
  window.location.href = `http://localhost:3000/auth/login`;
  // await userStore.logIn();
}
</script>

<style scoped>
h1 {
  font-size: 150px;
}

/* form {
  background: #151414e4;
  text-align: center;
  padding: 20px 28px;
  border: 2px #302d2d solid;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
} */

input,
button {
  width: 100%;
  margin-bottom: 1em;
}
</style>
