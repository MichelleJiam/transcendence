import { createRouter, createWebHistory } from "vue-router";
import routes from "./router";

const router = createRouter({
  history: createWebHistory(),
  // sets the active CSS class on <router-link> components
  // active to make the nav bar links compatible with the css
  routes,
});

// check if user is logged in
// if not can only access public pages
// router.beforeEach
export default router;
