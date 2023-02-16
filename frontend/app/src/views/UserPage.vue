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
          <span class="playerName">{{ store.user.playerName }}</span>
        </h1>
        <AvatarDisplay :src="store.user.avatarUrl" />
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
          <span class="validate-message"
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
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "@/stores/UserStore";

const twoFactorAuthentication = ref<boolean>();
const playerName = ref<string>("");
const isDisabled = ref<boolean>();

let message = "";

// const route = useRoute();
const store = useUserStore();

// store.setUserId(route.params.id); // temporary workaround: remove when user authentication is fixed

onMounted(async () => {
  await store.retrieveCurrentUserData();
  twoFactorAuthentication.value = store.user.twoFAEnabled;
  playerName.value = store.user.playerName;
  await store.getAvatar();
});

function submitAccountSettings() {
  store.updateAccountSettings(playerName.value, twoFactorAuthentication.value);
}

/*  client-Side input validation */

watch(playerName, () => {
  if (playerName.value?.length <= 3 || playerName.value?.length > 8) {
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
  height: auto;
  width: auto;
}

.user-info {
  /* HI "username" and avatar */
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

  flex-basis: 650px;
}

.account-settings {
  display: grid;
  justify-items: left;
  row-gap: 10px;
  grid-template-areas:
    "name-label inputfield"
    "fa-label checkbox"
    "validate validate"
    "button button";
}

h1 {
  font-size: 4.5em;
}

h2 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

.two-fa-settings-label {
  grid-area: fa-label;
  font-family: "ArcadeClassic", sans-serif;
  font-size: 30px;
}
.account-settings-button {
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
}
.validate-message {
  color: var(--validation-color);
}
.playerName {
  color: var(--primary-color);
}
</style>
