<template>
  <div class="box-styling">
    <div class="avatar-upload">
      <label for="avatar">Avatar</label>
      <div class="inputfield">
        <input
          type="file"
          accept="image/x-png,image/gif,image/jpeg"
          @change="onFileSelected"
        />
      </div>
    </div>
    <button :disabled="isDisabledAvatar" @click="submitAvatar">
      Update avatar
    </button>
  </div>
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
.box-styling {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px;
  /* row-gap: 10px; */
  /* grid-template-areas:
    "name-label inputfield"
    "button button"; */
}

.avatar-upload {
  display: flex;
  justify-content: space-between;
}
.avatar-upload .inputfield {
  display: inline-block;
  /* margin-right: 0; */
  /* grid-area: inputfield; */
  /* justify-self: end; */
}

button {
  /* grid-area: button; */
  justify-self: stretch;
}
</style>
