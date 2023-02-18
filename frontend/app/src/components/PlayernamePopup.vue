<template>
  <form>
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
      class="inputfield"
      id="playerName"
      v-model="playerName"
      label="Player Name"
      :placeholder="playerName"
    />
    <button @click.prevent="setPlayerName">Submit</button>
  </form>
</template>

<script setup lang="ts">
import { useAccountSettings } from "@/stores/AccountSettings";
import { ref } from "vue";
import InputText from "@/components/InputText.vue";

const store = useAccountSettings();

function setPlayerName() {
  // function that will update player name
  store.updatePlayername("test");
}

const playerName = ref<string>("");
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 33%;
  text-align: left;
}

label {
  /* margin-right: 20px; */
  align-self: center;
}

.inputfield {
  width: 100%;
}

button {
  width: 100%;
}

h2 {
  align-self: center;
  font-size: 2.5em;
}

p {
  margin-bottom: 20px;
}
</style>
