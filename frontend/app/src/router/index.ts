import { pinia } from "./../main";
import { createRouter, createWebHistory } from "vue-router";
import routes from "./router";
import { useUserStore } from "../stores/UserStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from) => {
  const userStore = useUserStore(pinia);
  console.log("beforeEach: authenticated?  ", userStore.isAuthenticated);
  const userAuthenticated = userStore.checkUserAuthStatus();
  // if (!userStore.isAuthenticated && to.name !== "login") {
  if (!userAuthenticated && to.name !== "login") {
    return { name: "login" };
  }
});

export default router;
