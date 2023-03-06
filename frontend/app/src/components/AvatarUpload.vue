<template>
  <form>
    <label for="avatar">Avatar</label>
    <div class="inputfield">
      <input
        type="file"
        accept="image/x-png,image/gif,image/jpeg"
        @change="onFileSelected"
      />
    </div>
    <button :disabled="isDisabledAvatar" @click="submitAvatar">
      Update avatar
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/UserStore";

const store = useUserStore();
type Avatar = {
  selectedFile?: File;
};

const isDisabledAvatar = ref<boolean>(true);
const avatar: Avatar = {};

async function onFileSelected(e: Event) {
  console.log("[DEBUG] onFileSelected() in AvatarUpload.vue");
  const target = e.target as HTMLInputElement;
  if (target.files) {
    if (target.files[0].size > 1000000) {
      alert("File can not be larger than 1mb");
      target.value = "";
      return;
    }
    avatar.selectedFile = target.files[0];
  }
  isDisabledAvatar.value = false;
}

async function submitAvatar() {
  console.log("[DEBUG] submitAvatar() in AvatarUpload.vue");
  if (avatar.selectedFile) {
    await store.updateAvatar(avatar.selectedFile);
  } else console.log("[DEBUG] No file selected");
}
</script>

<style scoped>
form {
  display: grid;
  row-gap: 10px;
  grid-template-areas:
    "name-label inputfield"
    "button button";
}

label {
  grid-area: name-label;
  justify-self: start;
}

.inputfield {
  display: inline-block;
  margin-right: 0;
  grid-area: inputfield;
  justify-self: end;
}

button {
  grid-area: button;
}
</style>
