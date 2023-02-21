<template>
  <main>
    <!-- <div v-if="promptFor2FA()"> -->
    <TwoFactorPopup class="twofa-popup" />
    <!-- </div> -->
  </main>
</template>

<script setup lang="ts">
import TwoFactorPopup from "@/components/TwoFactorPopup.vue";
import { useUserStore } from "@/stores/UserStore";
import { onMounted } from "vue";

const userStore = useUserStore();

onMounted(async () => {
  await userStore.retrieveCurrentUserData();
});

function promptFor2FA() {
  console.log("user: ", userStore.user);
  // console.log(
  //   "Prompt for 2FA? ",
  //   !userStore.isAuthenticated(),
  //   " && ",
  //   userStore.user.twoFAEnabled
  // );
  // return !userStore.isAuthenticated() && userStore.user.twoFAEnabled;
  return true;
}
</script>

<style scoped>
.twofa-popup {
  position: absolute;
  z-index: 2;
}

h1 {
  font-size: 10rem;
}
</style>
