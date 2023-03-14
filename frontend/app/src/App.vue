<template>
  <nav v-if="isAuthenticated()">
    <NavBar />
  </nav>
  <RouterView />
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import { useUserStore } from "@/stores/UserStore";
import { onMounted } from "vue";
import { UserStatus } from "./components/game/pong.types";
import { updateUserStatus } from "./utils/userStatus";

const userStore = useUserStore();

onMounted(async () => {
  // sets status to offline on window close
  window.addEventListener("beforeunload", () => {
    if (isAuthenticated()) {
      updateUserStatus(userStore.user.id, UserStatus.OFFLINE);
    }
  });
});

function isAuthenticated() {
  return userStore.isAuthenticated();
}
</script>
