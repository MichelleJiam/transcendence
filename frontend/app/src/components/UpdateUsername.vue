<template>
  <div class="form-group">
    <label for="username">Username</label>
    <input
      id="username"
      type="text"
      autocomplete="off"
      @input="updateUsername"
    />
  </div>
</template>

<script setup lang="ts">
// import { ref } from "vue";

// const input = ref("");

// const username: string | null = null; // this variable can be used for inline type validation

/*  $emit
 **
 ** change the value of a state in the parent component using the
 ** update:modelValue event emitter from the child component.
 **
 ** https://medium.com/@bsalwiczek/how-to-type-vue-3-emits-5e5f507d492c
 */

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const updateUsername = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<!--
  https://formkit.com/
  '$event.target' is possibly 'null'.ts(18047)

        :placeholder="store.accountSettings.username"
  -->
