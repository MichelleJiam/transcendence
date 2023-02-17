import { createRouter, createWebHistory } from "vue-router";
import routes from "./router";
import { useUserStore } from "../stores/UserStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const userStore = useUserStore();
  console.log("[DEBUG] beforeEach");
  if (to.name === "login") {
    return true;
  }
  if ((await userStore.checkAuthStatus()) === false) {
    console.log("User not authenticated, pushing to login");
    return { name: "login" };
  }
});

export default router;
