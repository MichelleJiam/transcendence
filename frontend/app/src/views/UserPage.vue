<template>
  <main>
    <TwoFactorPopup
      v-if="showTwoFAPopup"
      class="two-fa-popup"
      @uncheck="uncheckTwoFACheckbox"
      @close-popup="toggleTwoFAPopup(false)"
      @show-message="showMessage"
    ></TwoFactorPopup>
    <div id="display-content">
      <div class="user-info">
        <h1 class="user-title">
          Hi
          <span class="playerName">{{ store.user.playerName }}</span>
        </h1>
        <AvatarDisplay :src="store.user.avatarUrl" />
      </div>

      <div class="user-settings">
        <h2>You can edit your account settings here.</h2>
        <AvatarUpload @show-message="showMessage" />
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
          <span class="validate-message"
            ><i>{{ invalidMessage }}</i></span
          >
          <button
            :class="{ 'disabled-button': isDisabled }"
            :disabled="isDisabled"
            @click.prevent="updatePlayerName"
          >
            Update player name
          </button>
        </form>
        <form class="twofa-settings">
          <label class="two-fa-settings-label" for="player-name">2FA</label>
          <InputCheckbox
            id="twoFactorAuthentication"
            v-model:checked="twoFactorAuthentication"
            class="account-settings-checkbox"
            label="2FA"
            @change="checkForTwoFAPopup()"
          />
        </form>
        <div v-if="message" class="message">{{ message }}</div>
      </div>
    </div>
  </main>
  <div :class="{ overlay: showTwoFAPopup }"></div>
</template>

<script setup lang="ts">
import InputText from "@/components/InputText.vue";
import InputCheckbox from "@/components/InputCheckbox.vue";
import AvatarDisplay from "@/components/avatar/AvatarDisplay.vue";
import AvatarUpload from "@/components/avatar/AvatarUpload.vue";
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "@/stores/UserStore";
import TwoFactorPopup from "@/components/TwoFactorPopup.vue";
import apiRequest from "@/utils/apiRequest";

const twoFactorAuthentication = ref<boolean>();
const showTwoFAPopup = ref<boolean>(false);
const playerName = ref<string>("");
const isDisabled = ref<boolean>(true);
let invalidMessage = "";

const store = useUserStore();

const message = ref("");

const showMessage = (msg: string) => {
  message.value = msg;
  setTimeout(() => {
    message.value = "";
  }, 3000);
};

onMounted(async () => {
  await store.retrieveCurrentUserData();
  twoFactorAuthentication.value = store.user.twoFAEnabled;
  playerName.value = store.user.playerName;
  console.debug("2fa enabled? ", twoFactorAuthentication.value);
  await store.getAvatar();
});

async function checkForTwoFAPopup() {
  if (twoFactorAuthentication.value === true) {
    toggleTwoFAPopup(true);
  } else {
    toggleTwoFAPopup(false);
    await apiRequest(`/2fa/disable`, "post");
    showMessage("Two factor authentication has been disabled");
    // alert("Two factor authentication has been disabled");
    console.debug("2FA disabled");
  }
}

function toggleTwoFAPopup(newState: boolean) {
  showTwoFAPopup.value = newState;
}

async function updatePlayerName() {
  await store.updateAccountSettings(
    playerName.value,
    twoFactorAuthentication.value
  );
  showMessage("Player name succesfully updated");
}

function uncheckTwoFACheckbox() {
  twoFactorAuthentication.value = false;
  toggleTwoFAPopup(false);
}
/*  client-Side input validation */

watch(playerName, () => {
  if (playerName.value?.length <= 2 || playerName.value?.length > 8) {
    invalidMessage = "Player name must be between 3 and 8 characters";
    isDisabled.value = true;
  } else if (!validPlayerName(playerName.value)) {
    invalidMessage =
      "Player name can only include alphabetic characters, digits and the following special characters -_";
    isDisabled.value = true;
  }
  // if there was a change
  else if (playerName.value !== store.user.playerName) {
    isDisabled.value = false;
    invalidMessage = "";
  }
});

function validPlayerName(playerName: string) {
  return /^[a-zA-Z0-9-_!]+$/.test(playerName);
}
</script>

<style scoped>
#display-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  justify-content: center;
  height: auto;
  width: auto;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  flex-basis: 450px;
}

.user-settings {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 10px;
}

.account-settings {
  display: grid;
  justify-items: left;
  row-gap: 5px;
  grid-template-areas:
    "name-label inputfield"
    "validate validate"
    "button button";
}

.twofa-settings {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

h2 {
  font-size: 2.5em;
  margin-bottom: 10px;
}
.two-fa-settings-label {
  grid-area: fa-label;
  font-family: "ArcadeClassic", sans-serif;
  font-size: 30px;
}

.two-fa-popup {
  position: absolute;
  z-index: 2;
}
.disabled-button {
  background-color: var(--primary-color-transparant);
  cursor: not-allowed;
  pointer-events: none;
}

button {
  background-color: var(--primary-color);
  grid-area: button;
  justify-self: stretch;
}

.account-settings-checkbox {
  justify-self: end;
  grid-area: checkbox;
}
.account-settings-input {
  font-size: 18px;
  grid-area: inputfield;
  justify-self: end;
}

.validate-message {
  grid-area: validate;
  color: var(--validation-color);
}
.playerName {
  color: var(--primary-color);
}

form {
  padding: 10px;
}

@media (max-width: 1100px) {
  #display-content {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    justify-content: center;
    width: 600px;
    height: 90%;
  }
}

.message {
  background-color: #eaffe6;
  color: #000000;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}
</style>
