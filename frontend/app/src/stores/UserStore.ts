import { defineStore } from "pinia";
import { apiRequest } from "@/utils/apiRequest";
import router from "@/router";
import type { AxiosError } from "axios";

interface PublicProfile {
  id: number;
  playerName: string;
  status: string;
  avatarId: number;
  avatarUrl: string | undefined;
}

interface UserProfile extends PublicProfile {
  intraId: string;
  twoFAEnabled: boolean;
}

export const useUserStore = defineStore("user", {
  // state: () => ({
  //   authenticated: false,
  //   user: {
  //     id: 0,
  //     intraId: "",
  //     playerName: null,
  //     // password: "password", // TODO: remove
  //     // messages: [],
  //     twoFA: false,
  //     avatarId: null,
  //   },
  // }),
  state: () => {
    return {
      user: {} as UserProfile,
      authenticated: false,
    };
  },
  actions: {
    // AUTH
    isAuthenticated() {
      console.log("[DEBUG] isAuthenticated | returns ", this.authenticated);
      return this.authenticated === true;
    },
    async logIn() {
      console.log("[DEBUG] userStore.logIn");
      await this.retrieveCurrentUserData();
      this.authenticated = true;
      console.log("Trying to log in user id: ", this.user.id);
      // await router.push("/home");
    },
    async logOut() {
      console.log("[DEBUG] logOut");
      if (this.authenticated) {
        await apiRequest(`/auth/logout`, "get") // TODO: change method to POST later
          // .then(() => {
          //   this.authenticated = false;
          //   console.log("User logged out");
          // })
          .catch(() => {
            console.log("User already logged out");
          });
        this.authenticated = false;
        this.$reset();
        console.log(this.isAuthenticated());
      }
      console.log("About to push to login");
      await router.push("/login");
    },
    async checkAuthStatus(): Promise<boolean> {
      console.log("[DEBUG] checkAuthStatus");
      await apiRequest(`/auth/status`, "get")
        .then(async (response) => {
          this.authenticated = true;
          console.log("User is authenticated");
        })
        .catch(() => {
          this.authenticated = false;
          console.log("User is not authenticated");
        });
      return this.authenticated;
    },
    // USER DATA
    async retrieveCurrentUserData() {
      console.log("[DEBUG] retrieveUserData");
      try {
        // const res = await apiRequest(`/auth/status`, "get");
        const res = await apiRequest(`/user/current`, "get");
        this.user.id = res.data.id;
        this.user.playerName = res.data.playerName;
        this.user.twoFAEnabled = res.data.twoFAEnabled;
        this.user.avatarId = res.data.avatarID ?? null;
        return res.data.user;
      } catch (error) {
        console.log(`Error in retrieveCurrentUserData(): ${error}`);
      }
      return null;
    },
    async updateAccountSettings(
      newPlayerName: string,
      twoFA: boolean | undefined
    ) {
      console.log("[DEBUG] updateAccountSettings");
      try {
        await apiRequest(`/user/${this.user.id}/update-settings`, "put", {
          data: { playerName: newPlayerName, twoFAEnabled: twoFA },
        });
        this.retrieveCurrentUserData();
        alert("Your account settings were succesfully updated!");
      } catch (error) {
        this.handleError(error as AxiosError);
      }
    },

    /*********
     * avatar *
     *********/

    async updateAvatar(selectedFile: File) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        await apiRequest(`/user/${this.user.id}/avatar`, "post", {
          data: formData,
        });
      } catch (error) {
        console.log(`Error in updateAvatar(): ${error}`);
      }
    },
    async getAvatar() {
      try {
        const res = await apiRequest(`/user/${this.user.id}/avatar`, "get");
        this.user.avatarUrl = res.config.url;
      } catch (error) {
        console.log(`Error in getAvatar(): ${error}`);
      }
    },

    /*****************
     * error handling *
     *****************/

    handleError(error: AxiosError) {
      if (error.response && error.response.data) {
        console.log((error.response.data as Error).message);
        alert((error.response.data as Error).message);
      }
    },
  },
  persist: true,
});
