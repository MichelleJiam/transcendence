<template>
  <img class="avatar" :src="src" alt="Avatar" />
</template>

<script setup lang="ts">
defineProps({
  src: { type: String, default: "../assets/default-avatar.png" },
});
</script>

<!-- pass css styling as prop to set the width and height of the avatar so the component can be reused -->

<style scoped>
.avatar {
  width: 250px;
  height: 250px;
}
</style>
