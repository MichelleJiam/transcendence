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
        v-model:checked="twoFactorAuthentication"
        label="Two-factor authentication:"
      />
    </form>
    <button @click="updateAccountSettings">Update account settings</button>
  </div>
</template>

<script setup lang="ts">
import UpdateUserName from "@/components/UpdateUsername.vue";
import InputCheckbox from "@/components/InputCheckbox.vue";
import { useAccountSettings } from "@/stores/AccountSettings";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const twoFactorAuthentication = ref<boolean>();
const username = ref<string>("");

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
</script>
