<template>
  <img class="avatar" :src="src" alt="Avatar" />
</template>

<script setup lang="ts">
defineProps({
  src: { type: String }, //, default: "../assets/default-avatar.png" },
  // removed the default as it resulted in a 404 error,
  // removing it still seems to load in the default avatar correctly.
});
</script>

<!-- pass css styling as prop to set the width and height of the avatar so the component can be reused -->

<style scoped>
.avatar {
  width: 300px;
  height: 300px;
  border-radius: 50%;
}
</style>
