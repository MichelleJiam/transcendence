import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/HomeView.vue";
import About from "../views/AboutView.vue";
import Chat from "../views/ChatView.vue";
import Game from "../views/GameView.vue";
import AccountSettings from "../views/AccountSettingsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/about",
      name: "About",
      component: About,
    },
    {
      path: "/chat",
      name: "Chat",
      component: Chat,
    },
    {
      path: "/pong",
      name: "Game",
      component: Game,
    },
    {
      path: "/:id/account-settings",
      name: "AccountSettings",
      component: AccountSettings,
    },
  ],
});

export default router;
