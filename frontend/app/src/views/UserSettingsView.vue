<template>
  <div class="container">
    <h1 class="pt-3 pb-3">Account Settings ⚙️</h1>
    <h2>
      Hello <i>{{ store.userSettings.username }}</i
      >! You can edit your account settings here.
    </h2>
    <form>
      <UpdateUserName v-model="username" />
      <Update2FA v-model:checked="twoFactorAuthentication" />
    </form>
    <button
      @click="store.updateUserSettings(username, twoFactorAuthentication)"
    >
      Update settings
    </button>
  </div>
</template>

<script setup lang="ts">
import UpdateUserName from "@/components/UpdateUsername.vue";
import Update2FA from "@/components/Update2FA.vue";
import { useUserSettings } from "@/stores/userSettings";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const store = useUserSettings();
store.userSettings.userId = route.params.id;

store.getUserSettings();
const username = ref<string>("");
const twoFactorAuthentication = ref<boolean>(store.userSettings.twoFA);
</script>
