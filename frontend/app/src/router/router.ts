import LoginPage from "../views/LoginPage.vue";
import HomePage from "../views/MainView.vue";
import GamePage from "../views/GamePage.vue";
import UserPage from "../views/UserPage.vue";
import LeaderBoard from "../views/LeaderBoard.vue";
import LiveStream from "../views/LiveStream.vue";
import Chatroom from "../views/ChatroomMainPage.vue";
import SingleChatroom from "../views/ChatroomSingle.vue";
import NotFound from "../views/NotFound.vue";
import FriendPage from "../views/FriendPage.vue";
import TwoFAPage from "@/views/TwoFAPage.vue";
import type { Component } from "vue";

const routes: {
  path: string;
  component: Component;
  alias?: string[];
  name?: string;
}[] = [
  {
    path: "/",
    component: HomePage,
    alias: ["/home", "/homepage"],
    name: "home",
  },
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
  { path: "/stream", component: LiveStream },
  { path: "/chat", component: Chatroom },
  { path: "/chat/:id", component: SingleChatroom },
  { path: "/user/:playerName", component: HomePage },
  { path: "/:id/friends", component: FriendPage },
  { path: "/friends", component: FriendPage },
  { path: "/:pathMatch(.*)*", component: NotFound },
  { path: "/2fa", component: TwoFAPage, name: "2fa" },
  { path: "/404", component: NotFound },
];

export default routes;
