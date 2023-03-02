<template>
  <div class="form box-styling">
    <button class="exit-button" @click.prevent="cancelLogin">X</button>
    <h2>Hey there,</h2>
    <p>
      Welcome to our super-duper, incredibly awesome pong game! We're so excited
      that you've decided to join us for some ball-bouncing, paddle-smacking
      fun.<br /><br />
      But before we can get started, we need you to do one little thing for us:
      pick a player name. It's super easy and will only take a moment, we
      promise. And don't worry, we won't judge you if you choose something
      totally goofy (in fact, we encourage it).<br /><br />So what do you say,
      champ? Are you ready to show us what you've got and become a part of the
      pong-playing elite? Let's do this thing!
    </p>
    <label for="player-name">Player Name</label>
    <InputText
      id="playerName"
      v-model="playerName"
      class="inputfield"
      label="Player Name"
      placeholder="playername"
    />
    <span class="validate-message">{{ message }}</span>
    <button @click.prevent="setPlayerName">Submit</button>
    <!-- <button @click.prevent="setPlayerName">→</button> -->
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { ref, onMounted, watch } from "vue";
import InputText from "@/components/InputText.vue";
import router from "@/router";

const userStore = useUserStore();
const playerName = ref<string>("");
let message = "";

function setPlayerName() {
  userStore.updateAccountSettings(
    playerName.value,
    userStore.user.twoFAEnabled
  );
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
  if (playerName.value?.length <= 2 || playerName.value?.length > 8) {
    message = "Player name must be between 3 and 8 characters";
  } else if (!validPlayerName(playerName.value)) {
    message =
      "Player name can only include alphabetic characters, digits and the following special characters -_";
  } else {
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
</style>
