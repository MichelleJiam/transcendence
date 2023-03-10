import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/UserStore";
// import routes from "./router";
import LoginPage from "../views/LoginPage.vue";
import HomePage from "../views/MainView.vue";
import GamePage from "../views/GamePage.vue";
import UserPage from "../views/UserPage.vue";
import LeaderBoard from "../views/LeaderBoard.vue";
import Chatroom from "../views/ChatroomMainPage.vue";
import SingleChatroom from "../views/ChatroomSingle.vue";
import NotFound from "../views/NotFound.vue";
import NotAuthorized from "../views/NotAuthorized.vue";
import FriendPage from "../views/FriendPage.vue";
import TwoFAPage from "@/views/TwoFAPage.vue";
import GenericError from "@/views/GenericError.vue";
import type { Component } from "vue";

const routes: {
  path: string;
  component: Component;
  alias?: string[];
  name?: string;
}[] = [
  { path: "/", component: HomePage, name: "home" },
  { path: "/:id/home", component: HomePage },
  { path: "/login", component: LoginPage, name: "login" },
  { path: "/:id/game", component: GamePage } /* temp workaround */,
  { path: "/game", component: GamePage },
  {
    path: "/:id/account",
    component: UserPage,
    name: "account",
  } /* temp workaround */,
  { path: "/account", component: UserPage, alias: ["/user"] },
  { path: "/leaderboard", component: LeaderBoard },
  { path: "/chat", component: Chatroom },
  { path: "/chat/:id", component: SingleChatroom },
  { path: "/player/:playerName", component: HomePage },
  // { path: "/:id/friends", component: FriendPage },
  { path: "/friends", component: FriendPage },
  { path: "/2fa", component: TwoFAPage, name: "2fa" },
  { path: "/404", component: NotFound },
  { path: "/401", component: NotAuthorized },
  { path: "/error", component: GenericError },
  { path: "/:pathMatch(.*)*", component: NotFound },
];

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
