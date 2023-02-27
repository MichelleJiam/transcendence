<template>
  <form>
    <button class="exit-button" @click.prevent="cancelTwoFA">X</button>
    <h2>2FA Registration</h2>
    <p>Scan me with your authenticator app!</p>
    <img :src="qrCode" class="qr-code" />
    <!-- <qrcode-vue :value="qrCode" :margin="2" /> -->
    <form class="token-box" @submit.prevent="validateToken">
      <p>Enter the code shown in your authenticator app:</p>
      <input v-model="token" type="text" name="token" />
      <button type="submit" name="button">validate</button>
    </form>
    <p>{{ validationMessage }}</p>
  </form>
</template>

<script setup lang="ts">
import QrcodeVue from "qrcode.vue";
import { onMounted, ref } from "vue";
import apiRequest from "@/utils/apiRequest";

const token = ref<string>("");
const qrCode = ref();
let validationMessage = "";
const emit = defineEmits(["uncheck", "close-popup"]);

onMounted(async () => {
  console.log("mounting 2fa popup");
  await apiRequest(`/2fa/register`, "post")
    .then((response) => {
      console.log("response: ", response.data);
      qrCode.value = response.data;
    })
    .catch((err) => {
      console.log("Unable to get 2FA QR code: ", err);
    });
});

async function validateToken() {
  console.log("Sending token: ", token.value);
  await apiRequest(`/2fa/enable`, "post", {
    data: { twoFactorAuthCode: token.value },
  })
    .then(() => {
      alert("Two factor authentication successfully enabled!");
      emit("close-popup");
    })
    .catch((err) => {
      validationMessage = "Wrong two factor authentication code"; // not displaying
      console.log("Something went wrong with 2FA enabling: ", err);
    });
}

function cancelTwoFA() {
  emit("uncheck");
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 70%;
  max-width: 550px;
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
.token-box {
  align-self: center;
}
button {
  width: 100%;
}
h2 {
  align-self: center;
  font-size: 3em;
  margin: 20px;
}

.qr-code {
  width: 40%;
  height: 40%;
  align-self: center;
}
p {
  margin-bottom: 20px;
  font-size: 20px;
  margin: 20px;
  align-self: center;
}
</style>
