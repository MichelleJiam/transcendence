<template>
  <img class="avatar" :src="src" alt="Avatar" />
</template>

<script setup lang="ts">
defineProps({
  src: { type: String },
});
</script>

<!-- pass css styling as prop to set the width and height of the avatar so the component can be reused -->

<style scoped>
.avatar {
  object-fit: cover;
  width: 300px;
  height: 300px;
  border-radius: 50%;
}
</style>
