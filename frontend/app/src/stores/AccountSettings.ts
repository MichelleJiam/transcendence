import { defineStore } from "pinia";
import { apiRequest } from "@/utils/apiRequest";
import axios from "axios";

export type settings = {
  userId: string | string[];
  username: string;
  twoFA: boolean;
  email: string;
};

export type avatar = {
  url: string | undefined;
};

export const useAccountSettings = defineStore("accountSettings", {
  state: () => {
    return {
      accountSettings: {} as settings,
      avatar: {} as avatar,
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

    async getAvatar() {
      try {
        const res = await apiRequest(
          `/user/${this.accountSettings.userId}/avatar`,
          "get"
        );
        this.avatar.url = res.config.url;
      } catch (error) {
        console.log(`Error in getAvatar(): ${error}`);
      }
    },

    async updateAvatar(selectedFile: string | undefined) {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        console.log(formData);
      }
    },
  },
});

// async onAvatarUpload() {
//   if (this.avatar.selectedFile) {
//     const formData = new FormData();
//     formData.append("file", this.avatar.selectedFile!);

//     const res = await apiRequestFormData(
//       `/user/${this.$route.params.id}/avatar`,
//       "post",
//       formData
//     );
//     if (res.status) {
//       this.avatar.status = "Successfully updated avatar!";
//     } else {
//       this.avatar.status = "Something went wrong with uploading avatar";
//     }
//   }
// },
