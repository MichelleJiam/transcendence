<template>
  <img class="avatar" :src="src" alt="Avatar" />
</template>

<script setup lang="ts">
defineProps({
  src: { type: String },
});
</script>

<style scoped>
.avatar {
  object-fit: cover;
  width: 300px;
  height: 300px;
  border-radius: 50%;
}
</style>
