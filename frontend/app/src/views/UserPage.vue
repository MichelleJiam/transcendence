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
        <h1 class="user-title">
          Hi
          <span class="playerName">{{ store.accountSettings.playerName }}</span>
        </h1>
        <AvatarDisplay :src="store.avatar.url" />
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
            :placeholder="playerName"
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

#display-content {
  display: flex;
  justify-content: center;
  /* overwrite the size defined in the global css */
  height: auto;
  width: auto;
}

/* FLEX ITEM 1/2 */
.user-info {
  border: 2px solid white;
  /* HI "username" and avatar */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  flex-basis: 450px;
}

/* FLEX ITEM 2/2 */
.user-settings {
  border: 2px solid white;
  /* usersettings text, avatar upload component, input field, inputcheckbox, button */
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  flex-basis: 850px;
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
  /* margin-bottom: 20px; */
  margin: 0;
  font-size: 4.5em;
}
h2 {
  font-size: 3em;
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
.validate {
  color: var(--validation-color);
}
.playerName {
  /* color: #39ff14; */
  color: var(--primary-color);
}
</style>
