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
  { path: "/:id/account", component: UserPage, name: "account" },
  { path: "/account", component: UserPage, alias: ["/user"] },
  { path: "/leaderboard", component: LeaderBoard },
  { path: "/chat", component: Chatroom },
  { path: "/chat/:id", component: SingleChatroom },
  { path: "/player/:playerName", component: HomePage },
  { path: "/friends", component: FriendPage },
  { path: "/2fa", component: TwoFAPage, name: "2fa" },
  { path: "/404", component: NotFound },
  { path: "/401", component: NotAuthorized },
  { path: "/error", component: GenericError },
  { path: "/:pathMatch(.*)*", component: NotFound },
];

export default routes;
