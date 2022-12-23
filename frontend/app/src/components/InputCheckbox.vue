<template>
  <div class="form-group">
    <label :for="id">
      {{ label }}
    </label>
    <input
      :id="id"
      type="checkbox"
      :checked="checked"
      @input="updateCheckbox"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: { type: String, default: "" },
  id: { type: String, required: true },
  checked: {
    type: Boolean,
  },
});

const emit = defineEmits(["update:checked"]);

const updateCheckbox = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:checked", target.checked);
};
</script>
