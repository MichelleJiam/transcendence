import { createRouter, createWebHistory } from "vue-router";
import routes from "./router";
import { useUserStore } from "../stores/UserStore";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  // const navigationGuard = useNavigationStore();
  // if (!navigationGuard.loggedIn && to.name !== "login") {
  //   return { name: "login" };
  // }
  const userStore = useUserStore();
  console.log("beforeEach: authenticated?  ", userStore.isAuthenticated);
  if (!userStore.authenticated && to.name !== "login") {
    return { name: "login" };
  }
});

export default router;
