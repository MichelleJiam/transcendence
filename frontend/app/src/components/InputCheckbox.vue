<template>
  <div class="form-group">
    <label :for="id"> {{ label }} </label>
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
  checked: { type: Boolean },
  id: { type: String, required: true },
  label: { type: String, default: "" },
});

const emit = defineEmits(["update:checked"]);

const updateCheckbox = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:checked", target.checked);
};
</script>
