import LoginPage from "../views/LoginPage.vue";
import HomePage from "../views/MainView.vue";
import GamePage from "../views/GamePage.vue";
import UserPage from "../views/UserPage.vue";
import LeaderBoard from "../views/LeaderBoard.vue";
import LiveStream from "../views/LiveStream.vue";
import ChatRoom from "../views/ChatRoom.vue";
import NotFound from "../views/NotFound.vue";
import type { Component } from "vue";

const routes: { path: string; component: Component; alias?: string[] }[] = [
  { path: "/", component: HomePage, alias: ["/home", "/homepage"] },
  { path: "/login", component: LoginPage },
  { path: "/game", component: GamePage },
  { path: "/account", component: UserPage, alias: ["/user"] },
  { path: "/leaderboard", component: LeaderBoard },
  { path: "/stream", component: LiveStream },
  { path: "/chat", component: ChatRoom },
  { path: "/:pathMatch(.*)*", component: NotFound },
];

export default routes;
