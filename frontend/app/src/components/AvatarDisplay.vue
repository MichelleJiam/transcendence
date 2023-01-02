<template>
  <img class="avatar" :src="src" alt="Avatar" />
</template>

<!-- ../assets/default-avatar.jpg -->

<script setup lang="ts">
defineProps({
  src: { type: String, required: true },
});
</script>

<style scoped>
.avatar {
  width: 250px;
  height: 250px;
}
</style>
