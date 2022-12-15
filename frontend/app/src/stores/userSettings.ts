import { defineStore } from "pinia";
import { apiRequestBody, apiRequest } from "@/utils/apiRequest";

export type settings = {
  userId: string | string[];
  username: string;
};

export const useUserSettings = defineStore("UserSettings", {
  state: () => {
    return {
      userSettings: {} as settings,
    };
  },
  actions: {
    async getUsername() {
      const res = await apiRequest(
        `/user/id/${this.userSettings.userId}`,
        "get"
      );
      this.userSettings.username = res.data.username;
    },

    async updateUserName(newUsername: string) {
      const res = await apiRequestBody(
        `/user/${this.userSettings.userId}/update-settings`,
        "put",
        { username: newUsername }
      );
      this.userSettings.username = newUsername;
      alert("Your username succesfully updated");
    },
  },
  /* getters */
});
