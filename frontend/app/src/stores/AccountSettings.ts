import { defineStore } from "pinia";
import { apiRequest } from "@/utils/apiRequest";

export type settings = {
  userId: string | string[];
  username: string;
  twoFA: boolean;
  email: string;
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
        this.accountSettings.email = res.data.email;
      } catch (error) {
        console.log(`Error in getAccountSettings(): ${error}`);
      }
    },

    async updateAccountSettings(
      newUsername: string,
      twoFA: boolean | undefined
    ) {
      try {
        await apiRequest(
          `/user/${this.accountSettings.userId}/update-settings`,
          "put",
          { data: { username: newUsername, twoFA: twoFA } }
        );
        this.getAccountSettings(); /* how to protect this? */
        alert("Your account settings succesfully updated");
      } catch (error) {
        console.log(`Error in updateAccountSettings(): ${error}`);
      }
    },
    setUserId(userId: string | string[]) {
      this.accountSettings.userId = userId;
    },
  },
});
