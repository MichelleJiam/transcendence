<template>
  <form action="#!" class="avatar-upload-form">
    <label>Avatar: </label>
    <input type="file" @change="onFileSelected" />
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

<style>
.avatar-upload-form {
  display: flex;
  flex-direction: column;
}

/* input[:] */
</style>
