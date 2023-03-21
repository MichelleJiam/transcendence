<template>
  <input
    :id="id"
    type="text"
    autocomplete="off"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="updateText"
  />
</template>

<script setup lang="ts">
defineProps({
  id: { type: String, required: true },
  label: { type: String, default: "" },
  value: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: "" },
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const updateText = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<style scoped>
input {
  width: 200px;
}
</style>
