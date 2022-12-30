<!--
    this should be the main page layout
    so the basic nav bar and the content div
    then there should be different components that render
    on different circumstances
-->

<template>
  <main>
    <div id="display-content">
      <h1>account settings</h1>
      <h2>
        Hello <i>{{ store.accountSettings.username }}</i
        >! You can edit your account settings here.
      </h2>
      <AvatarDisplay />
      <form>
        <InputText
          id="username"
          v-model="username"
          label="Username:"
          :value="username"
        />
        <p class="validate">
          <i>{{ message }}</i>
        </p>
        <InputCheckbox
          id="twoFactorAuthentication"
          v-model:checked="twoFactorAuthentication"
          label="Two-factor authentication:"
        />
        <InputText
          id="email"
          label="Email:"
          :placeholder="store.accountSettings.email"
          :disabled="true"
        />
      </form>
      <button :disabled="isDisabled" @click="updateAccountSettings">
        Update account settings
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import InputText from "@/components/InputText.vue";
import InputCheckbox from "@/components/InputCheckbox.vue";
import AvatarDisplay from "@/components/AvatarDisplay.vue";
import { useAccountSettings } from "@/stores/AccountSettings";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const twoFactorAuthentication = ref<boolean>();
const username = ref<string>("");
const isDisabled = ref<boolean>();
let message = "";

const route = useRoute();
const store = useAccountSettings();

store.setUserId(route.params.id); // temporary workaround: remove when user authentication is fixed

onMounted(async () => {
  await store.getAccountSettings();
  twoFactorAuthentication.value = store.accountSettings.twoFA;
  username.value = store.accountSettings.username;
});

function updateAccountSettings() {
  store.updateAccountSettings(username.value, twoFactorAuthentication.value);
}

/* input validation */

watch(username, () => {
  if (username.value.length <= 3 || username.value.length > 8) {
    message = "Username must be between 3 and 8 characters";
    isDisabled.value = true;
  } else if (!validUsername(username.value)) {
    message =
      "Username can only include alphabetic characters, digits and the following special characters -_";
    isDisabled.value = true;
  } else {
    message = "";
    isDisabled.value = false;
  }
});

function validUsername(username: string) {
  return /^[a-zA-Z0-9-_!]+$/.test(username);
}
</script>

<style scoped>
h1 {
  font-size: 8rem;
}

.validate {
  color: red;
}
</style>
