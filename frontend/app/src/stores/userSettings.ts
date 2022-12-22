import { defineStore } from "pinia";
import { apiRequest } from "@/utils/apiRequest";

export type settings = {
  userId: string | string[];
  username: string;
  twoFA: boolean;
};

export const useUserSettings = defineStore("UserSettings", {
  state: () => {
    return {
      userSettings: {} as settings,
    };
  },
  actions: {
    async getUserSettings() {
      try {
        const res = await apiRequest(
          `/user/id/${this.userSettings.userId}`,
          "get"
        );
        this.userSettings.username = res.data.username;
        this.userSettings.twoFA = res.data.twoFA;
      } catch (error) {
        console.log(`ERROR: ${error}`);
      }
    },

    async updateUserSettings(newUsername: string, twoFA: boolean) {
      await apiRequest(
        `/user/${this.userSettings.userId}/update-settings`,
        "put",
        { data: { username: newUsername, twoFA: twoFA } }
      );
      this.getUserSettings();
      alert("Your settings succesfully updated");
    },
  },
});
