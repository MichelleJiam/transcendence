import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/UserStore";
import routes from "./router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from) => {
  const userStore = useUserStore();
  console.log("[DEBUG] beforeEach");
  if (to.name === "login" || to.name === "2fa") {
    return true;
  }
  // check if user's auth token expired in between page loads
  if ((await userStore.checkAuthStatus()) === false) {
    console.log("User not authenticated, pushing to login");
    return { name: "login" };
  }
  // checks if user's player name still has to be set (new account)
  if (userStore.user.playerName === null && to.name != "home") {
    console.log("Player name not set, pushing to home");
    return { name: "home" };
  }
});

export default router;
