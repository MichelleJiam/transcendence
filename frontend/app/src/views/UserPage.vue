<!--
    this should be the main page layout
    so the basic nav bar and the content div
    then there should be different components that render
    on different circumstances
-->

<template>
  <main>
    <div id="display-content">
      <h1>
        Hi
        <span class="playerName">{{ store.accountSettings.playerName }}</span>
      </h1>
      <h2>You can edit your account settings here.</h2>
      <AvatarDisplay :src="store.avatar.url" />
      <form>
        <AvatarUpload />
        <InputText
          id="playerName"
          v-model="playerName"
          label="Player Name: "
          :value="playerName"
        />
        <span class="validate">
          <i>{{ message }}</i>
        </span>
        <InputCheckbox
          id="twoFactorAuthentication"
          v-model:checked="twoFactorAuthentication"
          label="Two-factor authentication: "
        />
      </form>
      <button :disabled="isDisabled" @click="submitAccountSettings">
        Update account settings
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import InputText from "@/components/InputText.vue";
import InputCheckbox from "@/components/InputCheckbox.vue";
import AvatarDisplay from "@/components/AvatarDisplay.vue";
import AvatarUpload from "@/components/AvatarUpload.vue";
import { useAccountSettings } from "@/stores/AccountSettings";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const twoFactorAuthentication = ref<boolean>();
const playerName = ref<string>("");
const isDisabled = ref<boolean>();

let message = "";

const route = useRoute();
const store = useAccountSettings();

store.setUserId(route.params.id); // temporary workaround: remove when user authentication is fixed

onMounted(async () => {
  await store.getAccountSettings();
  twoFactorAuthentication.value = store.accountSettings.twoFA;
  playerName.value = store.accountSettings.playerName;
  await store.getAvatar();
});

function submitAccountSettings() {
  store.updateAccountSettings(playerName.value, twoFactorAuthentication.value);
}

/*  client-Side input validation */

watch(playerName, () => {
  if (playerName.value.length <= 3 || playerName.value.length > 8) {
    message = "Player name must be between 3 and 8 characters";
    isDisabled.value = true;
  } else if (!validPlayerName(playerName.value)) {
    message =
      "Player name can only include alphabetic characters, digits and the following special characters -_";
    isDisabled.value = true;
  } else {
    message = "";
    isDisabled.value = false;
  }
});

function validPlayerName(playerName: string) {
  return /^[a-zA-Z0-9-_!]+$/.test(playerName);
}
</script>

<style scoped>
h1 {
  font-size: 8rem;
}

.validate {
  color: red;
}

.playerName {
  color: #39ff14;
}
</style>
