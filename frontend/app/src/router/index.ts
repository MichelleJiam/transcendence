import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/HomeView.vue";
import About from "../views/AboutView.vue";
import ChatOverview from "../views/ChatOverview.vue";
import Chatroom from "../views/Chatroom.vue";
import Game from "../views/GameView.vue";

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
      name: "ChatOverview",
      component: ChatOverview,
    },
    {
      path: "/chat/all",
      name: "SpecificChatRoom",
      component: Chatroom,
    },
    {
      path: "/pong",
      name: "Game",
      component: Game,
    },
  ],
});

export default router;
