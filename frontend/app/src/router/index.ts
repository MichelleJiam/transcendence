import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Chat from "../views/Chat.vue";
import Game from "../views/Game.vue";
import Settings from "../views/Settings.vue";
import UserSettings from "../views/UserSettings.vue";

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
      path: "/:id/settings",
      name: "Settings",
      component: Settings,
    },
    {
      path: "/:id/user-settings",
      name: "UserSettings",
      component: UserSettings,
    },
  ],
});

export default router;
