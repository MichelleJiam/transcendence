<template>
  <div class="form-group">
    <input
      id="twoFA"
      type="checkbox"
      class="custom-control-input"
      @click="updateTwoFA"
    />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const updateTwoFA = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.checked);
};
</script>
