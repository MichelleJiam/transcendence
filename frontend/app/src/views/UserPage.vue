<!--
    this should be the main page layout
    so the basic nav bar and the content div
    then there should be different components that render
    on different circumstances
-->

<template>
  <main>
    <div id="display-content">
      <div class="user-info">
        <h1>
          Hi
          <span class="playerName">{{ store.accountSettings.playerName }}</span>
        </h1>
        <AvatarDisplay class="user-avatar" :src="store.avatar.url" />
      </div>

      <div class="user-settings">
        <h2>You can edit your account settings here.</h2>
        <AvatarUpload />
        <form class="account-settings">
          <label class="account-settings-label" for="player-name"
            >Player Name</label
          >
          <InputText
            id="playerName"
            v-model="playerName"
            class="account-settings-input"
            label="Player Name: "
            :value="playerName"
          />
          <span class="validate"
            ><i>{{ message }}</i></span
          >
          <label class="two-fa-settings-label" for="player-name">2FA</label>
          <InputCheckbox
            id="twoFactorAuthentication"
            v-model:checked="twoFactorAuthentication"
            class="account-settings-checkbox"
            label="2FA"
          />

          <button
            class="account-settings-button"
            :disabled="isDisabled"
            @click.prevent="submitAccountSettings"
          >
            Update account settings
          </button>
        </form>
      </div>
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
.validate {
  color: #da14ff;
}

.playerName {
  color: #39ff14;
}

#display-content {
  display: grid;
  grid-template-columns: 40% 60%;
  gap: 20px;
  padding: 40px;
  height: auto;
}

.user-info {
  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: stretch;
}
.user-avatar {
  border-radius: 50%;
  border: 5px solid #39ff14;
  align-self: center;
}

.user-settings {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.account-settings {
  display: grid;
  row-gap: 10px;
  grid-template-columns: 2fr 1fr;
  text-align: left;
  grid-template-areas:
    "name-label inputfield"
    "fa-label checkbox"
    "validate validate"
    "button button";
}

h1 {
  margin-bottom: 20px;
  font-size: 6em;
}
h2 {
  margin-bottom: 20px;
  font-size: 3em;
}
.account-settings-label {
  grid-area: name-label;
  font-family: "ArcadeClassic", sans-serif;
  font-size: 30px;
}

.two-fa-settings-label {
  grid-area: fa-label;
  font-family: "ArcadeClassic", sans-serif;
  font-size: 30px;
}
.account-settings-button {
  grid-area: button;
}

.account-settings-checkbox {
  margin: auto;
  grid-area: checkbox;
}

.account-settings-input {
  font-size: 18px;
  grid-area: inputfield;
}

.validate {
  grid-area: validate;
}
</style>
