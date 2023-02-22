<template>
  <main>
    <div id="display-content">
      <h1>2FA Authentication <br />Required</h1>
      <img class="picture" src="../assets/images/cat_door_security.gif" />
      <p>Please enter the code from your authenticator app.</p>
      <label for="authCode">Authenticator Code</label>
      <br />
      <InputText
        id="authCode"
        v-model="authCode"
        class="inputfield"
        label="AuthCode"
        placeholder="authenticator code"
      />
      <br />
      <br />
      <button @click="submitCode">Submit</button>
      <button @click="cancelLogin">Cancel Login</button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { ref } from "vue";
import InputText from "@/components/InputText.vue";
import router from "@/router";
import apiRequest from "@/utils/apiRequest";

const userStore = useUserStore();
const authCode = ref<string>("");

async function submitCode() {
  await apiRequest(`/2fa/authenticate`, "post", {
    data: { twoFactorAuthCode: authCode },
  })
    .then(async (response) => {
      if (response.status === 200) {
        await userStore.logIn();
      }
      router.push("/home");
    })
    .catch((err) => {
      console.log("Something went wrong with 2FA: ", err);
      alert("Wrong two factor authentication code!");
      // router.push("/login");
    });
}

async function cancelLogin() {
  await userStore.logOut();
  router.push("/login");
}
</script>

<style scoped>
h1 {
  font-size: 3em;
  margin-bottom: 50px;
}
.picture {
  width: 200px;
  height: 200px;
  border-radius: 50%;
}

p {
  margin-bottom: 20px;
  font-size: 20px;
  margin: 20px;
}

label {
  align-self: center;
}

.inputfield {
  width: 50%;
  max-width: 500px;
}

button {
  margin: 10px;
}
</style>
