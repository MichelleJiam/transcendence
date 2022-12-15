<template>
  <div class="form-group">
    <label for="formGroupExampleInput">Username</label>
    <input
      type="text"
      class="form-control"
      id="formGroupExampleInput"
      :placeholder="store.userSettings.username"
      v-model="username"
    />
  </div>
  <button @click="store.updateUserName(username)">Change name</button>
</template>

<script lang="ts">
import { useUserSettings } from "@/stores/userSettings";
import { useRoute } from "vue-router";

export default {
  name: "UpdateUserName",
  setup() {
    const store = useUserSettings();
    const route = useRoute();
    store.userSettings.userId = route.params.id;
    const username = "";
    store.getUsername();
    return { store, username };
  },
  methods: {},
};
</script>
