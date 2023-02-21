import { createRouter, createWebHistory } from "vue-router";
import routes from "./router";
import { useUserStore } from "../stores/UserStore";

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
});

export default router;
