import LoginPage from "../views/LoginPage.vue";
import HomePage from "../views/MainView.vue";
import GamePage from "../views/GamePage.vue";
import UserPage from "../views/UserPage.vue";
import LeaderBoard from "../views/LeaderBoard.vue";
import LiveStream from "../views/LiveStream.vue";
import ChatRoom from "../views/ChatRoom.vue";
import NotFound from "../views/NotFound.vue";
import FriendPage from "../views/FriendPage.vue";
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
  },
  { path: "/login", component: LoginPage, name: "login" },
  { path: "/game", component: GamePage },
  { path: "/:id/account", component: UserPage } /* temp workaround */,
  { path: "/account", component: UserPage, alias: ["/user"] },
  { path: "/leaderboard", component: LeaderBoard },
  { path: "/stream", component: LiveStream },
  { path: "/chat", component: ChatRoom },
  { path: "/:id/friends", component: FriendPage },
  { path: "/friends", component: FriendPage },
  { path: "/:pathMatch(.*)*", component: NotFound },
];

export default routes;
