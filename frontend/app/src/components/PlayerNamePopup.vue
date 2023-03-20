<template>
  <div class="form box-styling">
    <button class="exit-button" @click.prevent="cancelLogin">X</button>
    <h2>Hey There!</h2>
    <p>
      Greetings, Pong master! Before you can take on your opponents, we need to
      know your player name. Enter your cool, quirky, or downright silly name
      below, and get ready to dominate the leaderboard.
    </p>
    <!-- <label for="player-name">Player Name</label> -->
    <InputText
      id="playerName"
      v-model="playerName"
      class="inputfield"
      label="Player Name"
      placeholder="player name"
      @keydown.enter.prevent="setPlayerName"
    />
    <span class="validate-message">{{ message }}</span>
    <button
      :class="{ 'disabled-button': isDisabled }"
      :disabled="isDisabled"
      @click.prevent="setPlayerName"
    >
      Submit
    </button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { ref, onMounted, watch } from "vue";
import InputText from "@/components/InputText.vue";
import router from "@/router";

const userStore = useUserStore();
const playerName = ref<string>("");
const isDisabled = ref<boolean>(true);
let message = "";

function setPlayerName() {
  // protects @keydown.enter.prevent="setPlayerName" from updating account settings when the button is disabled
  if (isDisabled.value === false) {
    userStore.updateAccountSettings(
      playerName.value,
      userStore.user.twoFAEnabled
    );
  }
}

async function cancelLogin() {
  await userStore.logOut();
  router.push("/login");
}

onMounted(async () => {
  await userStore.retrieveCurrentUserData();
  playerName.value = userStore.user.playerName;
});

watch(playerName, () => {
  if (!playerName.value) {
    isDisabled.value === true;
  } else if (playerName.value?.length <= 2 || playerName.value?.length > 8) {
    message = "player name must be between 3 and 8 characters";
    isDisabled.value = true;
  } else if (!validPlayerName(playerName.value)) {
    isDisabled.value = true;
    message =
      "player name can only include alphabetic characters, digits and the following special characters -_";
  } else {
    isDisabled.value = false;
    message = "";
  }
});

function validPlayerName(playerName: string) {
  return /^[a-zA-Z0-9-_!]+$/.test(playerName);
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 550px;
  padding: 20px;
  text-align: left;
}

.exit-button {
  position: absolute;
  top: 0;
  left: 0;
  width: 25px;
  padding: 0;
  margin: 10px;
}

label {
  align-self: center;
}

.inputfield {
  width: 100%;
}

.validate-message {
  align-self: center;
  color: var(--validation-color);
}

button {
  width: 100%;
}

h2 {
  align-self: center;
  font-size: 3em;
}

p {
  margin-bottom: 20px;
  font-size: 20px;
}

.disabled-button {
  background-color: var(--primary-color-transparant);
  cursor: not-allowed;
  pointer-events: none;
}
</style>
