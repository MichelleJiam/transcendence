<template>
  <main>
    <div id="display-content">
      <h1>2FA Code <br />Required</h1>
      <img
        class="picture"
        src="../assets/images/cat_door_security.gif"
        alt="Cat stopping dog from entering door"
      />
      <p>Please enter the 6-digit code from your authenticator app.</p>
      <label for="authCode">Authenticator Code</label>
      <InputText
        id="authCode"
        v-model="authCode"
        class="inputfield"
        label="AuthCode"
        placeholder="authenticator code"
      />
      <div class="buttons">
        <button @click="submitCode">Submit</button>
        <button @click="cancelLogin">Cancel Login</button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { ref } from "vue";
import InputText from "@/components/InputText.vue";
import apiRequest from "@/utils/apiRequest";
import { useRouter } from "vue-router";
// import router from "@/router";

const router = useRouter();
const userStore = useUserStore();
const authCode = ref<string>("");

async function submitCode() {
  await apiRequest(`/2fa/authenticate`, "post", {
    data: { twoFactorAuthCode: authCode.value },
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
    });
}

async function cancelLogin() {
  await userStore.logOut();
  router.push("/login");
}
</script>

<style scoped>
#display-content {
  width: auto;
  height: auto;
  display: flex;
  gap: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
h1 {
  font-size: 3em;
}
.picture {
  width: 200px;
  height: 200px;
  border-radius: 50%;
}

p {
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
  width: 200px;
}
.buttons {
  width: 100%;
  flex-direction: row;
}
</style>
