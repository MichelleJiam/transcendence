import { defineStore } from "pinia";
import { apiRequest } from "@/utils/apiRequest";
import router from "@/router";

export const useUserStore = defineStore("user", {
  state: () => ({
    authenticated: false,
    user: {
      id: 0,
      intraId: 0,
      playerName: null,
      password: "password", // TODO: remove
      messages: [],
      twoFA: false,
      avatarId: null,
    },
  }),
  getters: {
    isAuthenticated: (state) => {
      console.log("Authenticated? ", state.authenticated);
      return state.authenticated;
    },
  },
  actions: {
    setAuthenticateToTrue() {
      this.authenticated = true;
    },

    async logIn() {
      console.log("userStore.logIn");
      if (!this.authenticated) {
        await apiRequest(`/auth/status`, "get")
          .then((response) => {
            this.setAuthenticateToTrue();
            // this.authenticated = true;
            // self.setAuthenticateToTrue();
            // this.user.id = response.data.id;
            // this.user.playerName = response.data.playerName;
            // this.user.messages = response.data.messages;
            // this.user.twoFA = response.data.twoFA;
            // this.user.avatarId = response.data.avatarID;
            console.log("Set authenticated to ", this.authenticated);
          })
          .catch(async () => {
            console.log("User could not be authorized");
            await router.push("http://localhost:3000/auth/login");
          });
      }
      // console.log("push to home");
      // await router.push("/home");
    },

    async checkUserAuthStatus() {
      await apiRequest(`/auth/status`, "get")
        .then((response) => {
          this.authenticated = true;
          return true;
        })
        .catch(() => {
          router.push("/login");
        });
    },

    async logOut() {
      // const header = {
      //   "Access-Control-Allow-Origin": "http://localhost:5173",
      // };
      await apiRequest(`/auth/logout`, "get");
      this.authenticated = false;
      // console.log("logout: Auth cookie: ", cookies.get("Authentication"));
      console.log("user logged out");
      await router.push("/login");
    },
  },
});
