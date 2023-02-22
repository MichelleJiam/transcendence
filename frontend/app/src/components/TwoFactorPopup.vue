<template>
  <form>
    <button class="exit-button" @click.prevent="cancelTwoFA">X</button>
    <h2>2FA Registration</h2>
    <img :src="qrCode" />
    <form class="token-box" @submit.prevent="validateToken">
      <p>Enter the code shown in your authenticator app:</p>
      <input v-model="token" type="text" name="token" />
      <button type="submit" name="button">validate</button>
    </form>
    <p>{{ validationMessage }}</p>
    <!-- <InputText
      id="code"
      v-model="code"
      class="inputfield"
      label="Code"
      placeholder="authenticator code"
    /> -->
  </form>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import InputText from "@/components/InputText.vue";
import apiRequest from "@/utils/apiRequest";

const token = ref<string>("");
const qrCode = ref();
let validationMessage = "";
const emit = defineEmits(["uncheck"]);

onMounted(async () => {
  console.log("mounting 2fa popup");
  await apiRequest(`/2fa/register`, "post", {
    data: { responseType: "blob" },
  })
    .then(async (response) => {
      // qrCode.value = response.data.qr;
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      qrCode.value = URL.createObjectURL(blob);
    })
    .catch((err) => {
      console.log("Unable to get 2FA QR code: ", err);
    });
});

async function validateToken() {
  await apiRequest(`/2fa/enable`, "post", {
    data: { twoFactorAuthCode: token },
  })
    .then(() => {
      alert("Two factor authentication successfully enabled!");
    })
    .catch((err) => {
      validationMessage = "Wrong two factor authentication code";
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
p {
  margin-bottom: 20px;
  font-size: 20px;
  margin: 20px;
}
</style>
