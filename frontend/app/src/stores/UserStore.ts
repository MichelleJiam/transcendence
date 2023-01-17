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
    async logIn() {
      console.log("userStore.logIn");
      if (!this.authenticated) {
        await apiRequest(`/auth/status`, "get")
          .then(async (response) => {
            this.authenticated = true;
            this.user.id = response.data.id;
            this.user.playerName = response.data.playerName;
            this.user.messages = response.data.messages;
            this.user.twoFA = response.data.twoFA;
            this.user.avatarId = response.data.avatarID;
            console.log("Set authenticated to ", this.authenticated);
          })
          .catch(() => {
            console.log("User could not be authorized");
          });
      }
      console.log("push to home");
      router.push("/home");
    },
    async logOut() {
      await apiRequest(`/auth/logout`, "get");
      this.authenticated = false;
    },
  },
  persist: true,
});
