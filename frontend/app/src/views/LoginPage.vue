<template>
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

label {
  display: block;
}

input,
button {
  width: 100%;
  margin-bottom: 1em;
}

/* label {
  font-size: 1em;
  display: inline-block;
  margin-bottom: 8px;
  font-size: 0.8rem;
  color: #a4a4a4;
} */

/* .input-parent {
  width: 100%;
  display: inline-block;
  margin-bottom: 1rem;
  color: white;
} */
/* .input-parent input {
  padding: 10px 18px;
  width: 100%;
  font-size: 1em;
  background: hsl(0, 1%, 19%);
  border: none;
  border-radius: 4px;
  outline: none;
  transition: all 0.2s ease;
  color: white;
} */
/* .input-parent input:hover {
  background: #404040;
} */
/* .input-parent input:focus {
  box-shadow: 0px 0px 0px 1px #0087ff;
} */

button {
  border: none;
  border-radius: 4px;
  /* transition: all 0.2s ease; */
}

/* button:focus {
  box-shadow: 0px 0px 0px 3px black;
} */

/* button:active {
  background: #0f213e;
} */
</style>
