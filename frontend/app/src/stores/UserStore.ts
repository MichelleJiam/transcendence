import { defineStore } from "pinia";
import { apiRequest } from "@/utils/apiRequest";
import router from "@/router";
import type { AxiosError } from "axios";
import { updateUserStatus } from "@/utils/userStatus";
import { UserStatus } from "@/components/game/pong.types";

export interface PublicProfile {
  id: number;
  playerName: string;
  status: number /* ONLINE | OFFLINE | GAME */;
  avatarUrl: string | undefined;
}

interface UserProfile extends PublicProfile {
  intraId: string;
  twoFAEnabled: boolean;
}

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: {} as UserProfile,
      authenticated: false,
    };
  },
  actions: {
    /********
     * AUTH *
     ********/

    isAuthenticated() {
      console.debug("[DEBUG] isAuthenticated | returns ", this.authenticated);
      return this.authenticated === true;
    },

    async logIn() {
      await this.retrieveCurrentUserData();
      await this.userIsLoggedIn();
      console.debug("[DEBUG] Trying to log in user id: ", this.user.id);
    },

    async logOut() {
      if (this.authenticated) {
        await apiRequest(`/auth/logout`, "post").catch(() => {
          console.debug("[DEBUG] User already logged out");
        });
        await this.userIsLoggedOut();
        this.$reset();
      }
      await router.push("/login");
    },

    async checkAuthStatus(): Promise<boolean> {
      await apiRequest(`/auth/status`, "get")
        .then(async () => {
          await this.userIsLoggedIn();
          console.debug("User is authenticated");
        })
        .catch(async () => {
          await this.userIsLoggedOut();
          console.debug("User is not authenticated");
        });
      return this.authenticated;
    },

    async userIsLoggedIn() {
      this.authenticated = true;
      if (this.user.id) {
        await updateUserStatus(this.user.id, UserStatus.ONLINE);
      }
    },

    async userIsLoggedOut() {
      this.authenticated = false;
      if (this.user.id) {
        await updateUserStatus(this.user.id, UserStatus.OFFLINE);
      }
    },

    /*************
     * USER DATA *
     *************/

    async retrieveCurrentUserData() {
      try {
        const res = await apiRequest(`/user/current`, "get");
        this.user.id = res.data.id;
        this.user.playerName = res.data.playerName;
        this.user.twoFAEnabled = res.data.twoFAEnabled;
        return res.data.user;
      } catch (error) {
        console.error(`Error in retrieveCurrentUserData(): ${error}`);
      }
      return null;
    },

    async updateAccountSettings(
      newPlayerName: string,
      twoFA: boolean | undefined
    ) {
      try {
        await apiRequest(`/user/${this.user.id}/update-settings`, "put", {
          data: { playerName: newPlayerName, twoFAEnabled: twoFA },
        });
        this.retrieveCurrentUserData();
      } catch (error) {
        this.handleError(error as AxiosError);
      }
    },

    /**********
     * AVATAR *
     **********/

    async updateAvatar(selectedFile: File) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        await apiRequest(`/user/${this.user.id}/avatar`, "post", {
          data: formData,
        });
        location.reload();
      } catch (error) {
        console.error(`Error in updateAvatar(): ${error}`);
      }
    },

    async getAvatar() {
      try {
        const res = await apiRequest(`/user/${this.user.id}/avatar`, "get");
        this.user.avatarUrl = res.config.url;
      } catch (error) {
        console.error(`Error in getAvatar(): ${error}`);
      }
    },

    /******************
     * ERROR HANDLING *
     ******************/

    handleError(error: AxiosError) {
      if (error.response && error.response.data) {
        console.error((error.response.data as Error).message);
        alert((error.response.data as Error).message);
      }
    },
  },
  persist: true,
});
