<template>
  <!-- <div class="input-form"> -->
  <!-- <label :for="id"> {{ label }} </label> -->
  <input
    :id="id"
    type="text"
    autocomplete="off"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="updateText"
  />
  <!-- </div> -->
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
<!--
  $emit

change the value of a state in the parent component using the
update:modelValue event emitter from the child component.

https://medium.com/@bsalwiczek/how-to-type-vue-3-emits-5e5f507d492c
-->
