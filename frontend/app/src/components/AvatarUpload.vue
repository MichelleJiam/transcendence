<template>
  <form>
    <label for="avatar">Avatar</label>
    <input
      type="file"
      accept="image/x-png,image/gif,image/jpeg"
      @change="onFileSelected"
    />
    <button :disabled="isDisabledAvatar" @click="submitAvatar">
      Update avatar
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAccountSettings } from "@/stores/AccountSettings";

const store = useAccountSettings();
type Avatar = {
  selectedFile?: File;
};

const isDisabledAvatar = ref<boolean>(true);
const avatar: Avatar = {};

async function onFileSelected(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    avatar.selectedFile = target.files[0];
  }
  // validate file before disabling the button
  // implement option for setting back the default avatar?
  isDisabledAvatar.value = false;
}

async function submitAvatar() {
  if (avatar.selectedFile) {
    store.updateAvatar(avatar.selectedFile);
  }
}
</script>

<style scoped>
form {
  display: grid;
  /* grid-template-columns: 1fr 3fr 2fr; */
  grid-template-columns: 3fr 2fr;
  grid-template-areas:
    "label input"
    "button button";

  column-gap: 10px;
  text-align: left;
  row-gap: 10px;
}

label {
  grid-area: label;
  font-family: "ArcadeClassic", sans-serif;
  font-size: 30px;
}

input {
  grid-area: input;
  font-size: 18px;
}

button {
  grid-area: button;
}
</style>
