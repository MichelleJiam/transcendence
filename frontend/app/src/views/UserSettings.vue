<template>
  <div class="container">
    <h1 class="pt-3 pb-3">Account Settings ⚙️</h1>
    <h2>
      Hello <mark>{{ store.userSettings.username }}</mark
      >! You can edit your account settings here.
    </h2>
    <form>
      <UpdateUserName />
    </form>
  </div>
</template>

<script lang="ts">
import UpdateUserName from "@/components/UpdateUsername.vue";
import { useUserSettings } from "@/stores/userSettings";
export default {
  name: "Home",
  components: { UpdateUserName },
  setup() {
    const store = useUserSettings();
    return { store };
  },
};
</script>

<!-- 

<script lang="ts">
import { useUserSettings } from "@/stores/userSettings";
import { useRoute } from "vue-router";

export default {
  name: "UserSettings",
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
 -->
