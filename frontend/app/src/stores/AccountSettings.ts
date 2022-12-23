import { defineStore } from "pinia";
import { apiRequest } from "@/utils/apiRequest";

export type settings = {
  userId: string | string[];
  username: string;
  twoFA: boolean;
};

export const useAccountSettings = defineStore("accountSettings", {
  state: () => {
    return {
      accountSettings: {} as settings,
    };
  },
  actions: {
    async getAccountSettings() {
      try {
        const res = await apiRequest(
          `/user/id/${this.accountSettings.userId}`,
          "get"
        );
        this.accountSettings.username = res.data.username;
        this.accountSettings.twoFA = res.data.twoFA;
        return res;
      } catch (error) {
        console.log(`ERROR: ${error}`);
      }
    },

    async updateAccountSettings(newUsername: string) {
      await apiRequest(
        `/user/${this.accountSettings.userId}/update-settings`,
        "put",
        { data: { username: newUsername, twoFA: this.accountSettings.twoFA } }
      );
      this.getAccountSettings();
      alert("Your settings succesfully updated");
    },
    setUserId(userId: string | string[]) {
      this.accountSettings.userId = userId;
    },
  },
});
