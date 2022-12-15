<template>
  <div class="container">
    <h1 class="pt-3 pb-3">Edit your profile ⚙️</h1>
    <p>Hello! You can edit your account settings here.</p>

    <!-- Start avatar img -->
    <!-- :src="avatar.image" -->
    <!-- src="@/assets/default-avatar.jpg" -->
    <img
      :src="avatar.image"
      alt="Avatar"
      class="img-thumbnail rounded-circle"
      style="max-width: 25%"
    />
    <!-- end avatar img -->

    <form>
      <!-- start upload avatar -->
      <div class="mb-3">
        <label for="formFile" class="form-label">Avatar</label>
        <input
          class="form-control"
          type="file"
          id="formFile"
          @change="onFileSelected"
        />
      </div>
      <!-- end upload avatar -->

      <!-- start username field -->
      <div class="form-group">
        <label for="formGroupExampleInput">Username</label>
        <input
          type="text"
          class="form-control"
          id="formGroupExampleInput"
          v-bind:style="styleObject"
          :placeholder="user.username"
          v-model="user.username"
        />
      </div>
      <!-- end username field -->

      <!-- start email field:
      - proted from changing it to enabled in inspect?
      -->
      <div class="form-group">
        <label for="formGroupExampleInput">Email</label>
        <input
          type="text"
          class="form-control"
          id="formGroupExampleInput"
          :placeholder="user.email"
          disabled
        />
      </div>
      <!-- end email field -->

      <!-- start twoFA checkbox -->
      <div class="custom-control custom-switch mt-4">
        <input
          type="checkbox"
          class="custom-control-input"
          id="customSwitches"
          value=""
          v-model="user.twoFA"
        />
        <label class="custom-control-label" for="customSwitches">
          &nbsp;Two Factor Authentication: {{ user.twoFA }}</label
        >
      </div>
      <!-- end twoFA checkbox -->

      <button @click="updateProfile()" type="button" class="btn btn-dark mt-4">
        Change settings
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import {
  apiRequest,
  apiRequestBody,
  apiRequestFormData,
} from "@/utils/apiRequest";

// import { useUserSettings } from "@/stores/userSettings";

// const storeUserSettings = useUserSettings();

export default {
  data() {
    type UserAccount = {
      username?: string;
      email?: string;
      twoFA?: boolean;
    };

    type Avatar = {
      selectedFile?: string;
      status?: string;
      image?: any;
    };

    const user: UserAccount = {};
    const avatar: Avatar = {};

    return {
      user,
      avatar,
      styleObject: {
        color: "gray",
      },
    };
  },
  methods: {
    updateProfile() {
      this.updateUser();
      this.onAvatarUpload();
      alert("Your profile succesfully updated");
    },

    async getUser() {
      const res = await apiRequest(`/user/id/${this.$route.params.id}`, "get");
      this.user = res.data;
      console.log("this.user = ", this.user);
    },

    updateUser() {
      const data = {
        username: this.user.username,
        twoFA: this.user.twoFA,
      };

      apiRequestBody(
        `/user/${this.$route.params.id}/update-settings`,
        "put",
        data
      );
    },

    onFileSelected(event: any) {
      this.avatar.selectedFile = event.target.files[0];
      this.avatar.status = "";
      console.log(this.avatar.selectedFile);
    },

    async onAvatarUpload() {
      if (this.avatar.selectedFile) {
        const formData = new FormData();
        formData.append("file", this.avatar.selectedFile!);

        const res = await apiRequestFormData(
          `/user/${this.$route.params.id}/avatar`,
          "post",
          formData
        );
        if (res.status) {
          this.avatar.status = "Successfully updated avatar!";
        } else {
          this.avatar.status = "Something went wrong with uploading avatar";
        }
      }
    },
    async getFile() {
      const res = await apiRequest(
        `/user/${this.$route.params.id}/avatar`,
        "get"
      );

      if (res.status) {
        console.log("response is ok");
      } else {
        console.log("response is not ok");
      }
      this.avatar.image = res.config.url;
    },
  },
  /* data available when page loads */
  mounted() {
    this.getUser();
    this.getFile();
  },
};
</script>

<style>
.form-control {
  color: gray;
}
</style>
