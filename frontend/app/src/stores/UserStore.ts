import { defineStore } from "pinia";
import { apiRequest } from "@/utils/apiRequest";
import router from "@/router";

// interface PublicProfile {
//   id: number;
//   playerName: string;
//   status: string;
//   avatarId: number;
// }

// interface UserProfile extends PublicProfile {
//   twoFA: boolean;
// }

// interface UserStore {
//   authenticated: boolean;
//   profile: UserProfile | null;
// }

export const useUserStore = defineStore("user", {
  state: () => ({
    authenticated: false,
    user: {
      // profile: null as UserProfile | null,
      id: 0,
      // intraId: 0,
      playerName: null,
      // password: "password", // TODO: remove
      // messages: [],
      twoFA: false,
      avatarId: null,
    },
  }),
  // state: (): UserStore => {
  //   return {
  //     authenticated: false,
  //     profile: null,
  //   };
  // },
  // getters: {
  //   isAuthenticated: (state) => { // commented out because gives not callable error
  //     console.log("Authenticated? ", state.authenticated);
  //     return state.authenticated === true;
  //   },
  // },
  actions: {
    isAuthenticated() {
      console.log("Authenticated? ", this.authenticated);
      return this.authenticated === true;
    },
    async logIn() {
      console.log("[DEBUG] userStore.logIn");
      this.authenticated = true;
      await this.checkAuthStatus(); // fixes mainpage loading after logout
      await this.getUserData();
      console.log("Trying to log in user id: ", this.user.id);
      await router.push("/home");
    },
    async logOut() {
      console.log("[DEBUG] logOut");
      if (this.authenticated) {
        await apiRequest(`/auth/logout`, "get") // TODO: change method to POST later
          .then(() => {
            this.authenticated = false;
            console.log("User logged out");
          })
          .catch(() => {
            console.log("User already logged out");
          });

        console.log("Authenticated: ", this.authenticated);
      }
      console.log("About to push to login");
      await router.push("/login");
    },
    async checkAuthStatus() {
      console.log("[DEBUG] checkAuthStatus");
      await apiRequest(`/auth/status`, "get")
        .then(() => {
          this.authenticated = true;
          // this.user.twoFA = response.data.user.twoFA;
          console.log("User is authenticated");
          return true;
        })
        .catch(() => {
          this.authenticated = false;
          console.log("User is not authenticated");
          // await router.push("/login");
          return false;
        });
    },
    // async getUserData(): Promise<UserProfile | null> {
    async getUserData() {
      console.log("[DEBUG] getUserData");
      await apiRequest(`/auth/status`, "get")
        .then((response) => {
          console.log("id in getUserData response: " + response.data.user.id);
          // if (this.profile) {
          this.user.id = response.data.user.id;
          this.user.playerName = response.data.user.playerName;
          this.user.twoFA = response.data.user.twoFA;
          this.user.avatarId = response.data.user.avatarID;
          // }
          return response.data.user;
        })
        .catch(async () => {
          console.log("User is not authenticated");
        });
      return null;
    },
  },
  persist: true,
});
