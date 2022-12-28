<template>
  <div class="container">
    <h1 class="pt-3 pb-3">Account Settings ⚙️</h1>
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
        @test="updateTest"
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
  {{ twoFactorAuthentication }}
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
  if (username.value.length <= 3 || username.value.length > 25) {
    message = "Username must be between 3 and 25 characters";
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

function updateTest(value: string) {
  console.log(value);
}
</script>

<style scoped>
.validate {
  color: red;
}
</style>
