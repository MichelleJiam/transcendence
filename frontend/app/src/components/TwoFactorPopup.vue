<template>
  <form class="form box-styling">
    <button class="exit-button" @click.prevent="cancelTwoFA">X</button>
    <h2>2FA Registration</h2>
    <p>Scan me with your authenticator app!</p>
    <img :src="qrCode" class="qr-code" />
    <form class="code-box" @submit.prevent="validateAuthCode">
      <p>Enter the 6-digit code shown in your authenticator app:</p>
      <input
        v-model="authCode"
        type="text"
        name="authCode"
        autocomplete="off"
        @click="clearInputAndMessage"
      />
      <span class="validate-message">{{ validationMessage }}</span>
      <button type="submit">validate</button>
    </form>
  </form>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import apiRequest from "@/utils/apiRequest";

const authCode = ref<string>("");
const qrCode = ref();
const validationMessage = ref<string>("");
const emit = defineEmits(["uncheck", "close-popup", "show-message"]);

onMounted(async () => {
  await apiRequest(`/2fa/register`, "post")
    .then((response) => {
      qrCode.value = response.data;
    })
    .catch((err) => {
      console.error("Unable to get 2FA QR code: ", err);
    });
});

async function validateAuthCode() {
  await apiRequest(`/2fa/enable`, "post", {
    data: { twoFactorAuthCode: authCode.value },
  })
    .then(() => {
      // alert("Two factor authentication successfully enabled!");
      emit("show-message", "Two factor authentication successfully enabled!");
      emit("close-popup");
    })
    .catch((err) => {
      if (err.response.status === 401) {
        validationMessage.value = "Wrong two factor authentication code";
      } else {
        validationMessage.value =
          "Something went wrong with enabling 2FA. Please try again";
      }
    });
}

function clearInputAndMessage() {
  authCode.value = "";
  validationMessage.value = "";
}

async function cancelTwoFA() {
  await apiRequest(`/2fa/disable`, "post");
  emit("uncheck");
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 550px;
  padding: 20px;
  align-items: center;
}

.exit-button {
  position: absolute;
  top: 0;
  left: 0;
  width: 25px;
  padding: 0;
  margin: 10px;
}
.code-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  gap: 10px;
}
.validate-message {
  /* align-self: center; */
  color: var(--validation-color);
}
.qr-code {
  width: 40%;
  height: 40%;
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
  font-size: 20px;
  margin: 20px;
  align-self: center;
}
</style>
