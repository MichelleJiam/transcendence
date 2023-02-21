<template>
  <form>
    <button class="exit-button" @click.prevent="cancelLogin">X</button>
    <h2>Two Factor Authentication required</h2>
    <p>Please enter the code from your authenticator app.</p>
    <label for="code">Code</label>
    <InputText
      id="code"
      v-model="code"
      class="inputfield"
      label="Code"
      placeholder="authenticator code"
    />
    <button @click.prevent="submitCode">Submit</button>
  </form>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { ref } from "vue";
import InputText from "@/components/InputText.vue";
import router from "@/router";
import apiRequest from "@/utils/apiRequest";

const userStore = useUserStore();
const code = ref<string>("");

async function submitCode() {
  await apiRequest(`/2fa/authenticate`, "post")
    .then((response) => {
      if (response.status === 200) {
        userStore.logIn();
      }
    })
    .catch((err) => {
      console.log("Something went wrong with 2FA: ", err);
    });
}

async function cancelLogin() {
  await userStore.logOut();
  router.push("/login");
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 70%;
  text-align: left;
}

.exit-button {
  position: absolute;
  top: 0;
  left: 0;
  width: 25px;
  padding: 0;
  margin: 10px;
}

label {
  align-self: center;
}

.inputfield {
  width: 100%;
}

button {
  width: 100%;
}

h2 {
  align-self: center;
  font-size: 3em;
  margin: 20px;
}

p {
  margin-bottom: 20px;
  font-size: 20px;
  margin: 20px;
}
</style>
