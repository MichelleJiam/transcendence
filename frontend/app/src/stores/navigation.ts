import { defineStore } from "pinia";
import { ref } from "vue";

export const useNavigationStore = defineStore("navigationGuard", () => {
  const loggedIn = ref<boolean>(true); // change to false

  return { loggedIn };
});
