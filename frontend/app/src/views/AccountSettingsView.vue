<template>
  <div class="container">
    <h1 class="pt-3 pb-3">Account Settings ⚙️</h1>
    <h2>
      Hello <i>{{ store.accountSettings.username }}</i
      >! You can edit your account settings here.
    </h2>
    <form>
      <InputText
        id="username"
        v-model="username"
        label="Username:"
        :value="username"
      />
      <p class="validate">
        <i>{{ msg }}</i>
      </p>
      <InputCheckbox
        id="twoFactorAuthentication"
        v-model:checked="twoFactorAuthentication"
        label="Two-factor authentication:"
      />
    </form>
    <button :disabled="isDisabled" @click="updateAccountSettings">
      Update account settings
    </button>
    <p>|{{ username }}|</p>
  </div>
</template>

<script setup lang="ts">
import InputText from "@/components/InputText.vue";
import InputCheckbox from "@/components/InputCheckbox.vue";
import { useAccountSettings } from "@/stores/AccountSettings";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const twoFactorAuthentication = ref<boolean>();
const username = ref<string>("");
const isDisabled = ref<boolean>();
let msg = "";

const route = useRoute();
const store = useAccountSettings();

store.setUserId(route.params.id);

onMounted(async () => {
  await store.getAccountSettings();
  twoFactorAuthentication.value = store.accountSettings.twoFA;
  username.value = store.accountSettings.username;
});

function updateAccountSettings() {
  store.updateAccountSettings(username.value, twoFactorAuthentication.value);
}

watch(username, () => {
  if (username.value.length <= 3 || username.value.length > 25) {
    msg = "Username must be between 3 and 25 characters";
    isDisabled.value = true;
  } else if (containsWhitespace(username.value)) {
    msg = "username can not contain whitespace";
  } else {
    msg = "";
    isDisabled.value = false;
  }
});

function containsWhitespace(username: string) {
  return /\s/.test(username);
}
</script>

<style scoped>
.validate {
  color: red;
}
</style>
