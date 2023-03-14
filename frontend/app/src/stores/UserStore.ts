import { defineStore } from "pinia";
import { apiRequest } from "@/utils/apiRequest";
import router from "@/router";
import type { AxiosError } from "axios";
import { updateUserStatus } from "@/utils/userStatus";
import { UserStatus } from "@/components/game/pong.types";

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

interface Achievement {
  id: number;
  name: string;
  icon: string;
}

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: {} as UserProfile,
      authenticated: false,
      achievements: [] as Achievement[],
    };
  },
  actions: {
    /********
     * AUTH *
     ********/

    isAuthenticated() {
      console.log("[DEBUG] isAuthenticated | returns ", this.authenticated);
      return this.authenticated === true;
    },

    async logIn() {
      console.log("[DEBUG] userStore.logIn");
      await this.retrieveCurrentUserData();
      await this.userIsLoggedIn();
      console.log("Trying to log in user id: ", this.user.id);
    },

    async logOut() {
      console.log("[DEBUG] logOut");
      if (this.authenticated) {
        await apiRequest(`/auth/logout`, "post").catch(() => {
          console.log("User already logged out");
        });
        await this.userIsLoggedOut();
        this.$reset();
      }
      await router.push("/login");
    },

    async checkAuthStatus(): Promise<boolean> {
      console.log("[DEBUG] checkAuthStatus");
      await apiRequest(`/auth/status`, "get")
        .then(async () => {
          await this.userIsLoggedIn();
          console.log("User is authenticated");
        })
        .catch(async () => {
          await this.userIsLoggedOut();
          console.log("User is not authenticated");
        });
      return this.authenticated;
    },

    async userIsLoggedIn() {
      this.authenticated = true;
      if (this.user.id) await updateUserStatus(this.user.id, UserStatus.ONLINE);
    },

    async userIsLoggedOut() {
      this.authenticated = false;
      if (this.user.id)
        await updateUserStatus(this.user.id, UserStatus.OFFLINE);
    },

    /*************
     * USER DATA *
     *************/

    async retrieveCurrentUserData() {
      console.log("[DEBUG] retrieveUserData");
      try {
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

    /**********
     * AVATAR *
     **********/

    async updateAvatar(selectedFile: File) {
      console.log("[DEBUG] updateAvatar() in UserStore.ts");
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        await apiRequest(`/user/${this.user.id}/avatar`, "post", {
          data: formData,
        });
        location.reload();
      } catch (error) {
        console.log(`[DEBUG] error in updateAvatar(): ${error}`);
      }
    },

    async getAvatar() {
      console.log("[DEBUG] getAvatar() in UserStore.ts");
      try {
        const res = await apiRequest(`/user/${this.user.id}/avatar`, "get");
        this.user.avatarUrl = res.config.url;
      } catch (error) {
        console.log(`[DEBUG] error in getAvatar(): ${error}`);
      }
    },

    /****************
     * ACHIEVEMENTS *
     ****************/

    async getAchievements() {
      try {
        const res = await apiRequest(
          `/user/${this.user.id}/achievements`,
          "get"
        );
        if (res) this.achievements = res.data;
      } catch (error) {
        console.log(`Error in getAchievements(): ${error}`);
      }
    },

    /******************
     * ERROR HANDLING *
     ******************/

    handleError(error: AxiosError) {
      if (error.response && error.response.data) {
        console.log((error.response.data as Error).message);
        alert((error.response.data as Error).message);
      }
    },
  },
  persist: true,
});
