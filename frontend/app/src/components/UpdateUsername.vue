<template>
  <div class="form-group">
    <label for="username">Username</label>
    <input
      id="username"
      type="text"
      class="form-control"
      autocomplete="off"
      @input="updateUsername"
    />
    <!-- <p>{{ username }}</p> -->
    <!-- <div v-if="error">
      {{ error }}
    </div> -->
  </div>
  <!-- <button @click="store.updateUserName(username)">Change name</button> -->
</template>

<script setup lang="ts">
// import { useAccountSettings } from "@/stores/AccountSettings";

// const store = useAccountSettings();

// const username: string | null = null; // this variable can be used for inline type validation

// const error = computed(() => {
//   return username === "" ? "The Input field is required" : "";
// });

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
