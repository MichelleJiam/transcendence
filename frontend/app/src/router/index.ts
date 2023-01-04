import { createRouter, createWebHistory } from "vue-router";
import routes from "./router";
import { useNavigationStore } from "../stores/navigation";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const navigationGuard = useNavigationStore();
  if (!navigationGuard.loggedIn && to.name !== "login") {
    return { name: "login" };
  }
});

export default router;
