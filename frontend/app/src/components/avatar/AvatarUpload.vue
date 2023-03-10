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
    <button
      :disabled="isDisabledAvatar"
      :class="{ lightbutton: !isDisabledAvatar }"
      @click="submitAvatar"
    >
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
.box-styling {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px;
}

.avatar-upload {
  display: flex;
  justify-content: space-between;
}
.avatar-upload .inputfield {
  display: inline-block;
  margin-bottom: 10px;
}

.lightbutton {
  background-color: var(--primary-color);
}

button {
  background-color: var(--primary-color-transparant);
  justify-self: stretch;
}
</style>
