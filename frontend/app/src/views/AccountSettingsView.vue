<template>
  <div class="container">
    <h1 class="pt-3 pb-3">Account Settings ⚙️</h1>
    <h2>
      Hello <i>{{ store.accountSettings.username }}</i
      >! You can edit your account settings here.
    </h2>
    <form>
      <UpdateUserName v-model="username" />
      <InputCheckbox
        id="twoFactorAuthentication"
        v-model:checked="store.accountSettings.twoFA"
        label="Two-factor authentication:"
      />
    </form>
    <button @click="store.updateAccountSettings(username)">
      Update account settings
    </button>
  </div>
</template>

<script setup lang="ts">
import UpdateUserName from "@/components/UpdateUsername.vue";
import InputCheckbox from "@/components/InputCheckbox.vue";
import { useAccountSettings } from "@/stores/AccountSettings";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const store = useAccountSettings();

store.setUserId(route.params.id);

store.getAccountSettings();

// hooks?

// const twoFactorAuthentication = ref<boolean>(store.accountSettings.twoFA);
const username = ref<string>(store.accountSettings.username);

console.log("test = ", store.accountSettings.twoFA);
console.log("test = ", store.accountSettings.username);

// setter function
// on submit function for button
</script>
