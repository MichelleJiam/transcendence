<template>
  <div class="container">
    <h1 class="pt-3 pb-3">Edit your profile ⚙️</h1>
    <p>
      Hello <b>{{ displayUser }}</b
      >! You can edit your account settings here.
    </p>

    <!-- Start avatar img -->
    <img
      src="@/assets/default-avatar.jpg"
      alt="Avatar"
      class="img-thumbnail rounded-circle"
      style="max-width: 25%"
    />
    <!-- end avatar img -->

    <form>
      <!-- start upload avatar -->
      <div class="mb-3">
        <label for="formFile" class="form-label">Avatar</label>
        <input class="form-control" type="file" id="formFile" />
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
export default {
  data() {
    type UserAccount = {
      username?: string;
      email?: string;
      twoFA?: boolean;
    };

    const user: UserAccount = {};
    const displayUser: string = "";

    return {
      user,
      displayUser,
      styleObject: {
        color: "gray",
      },
    };
  },
  methods: {
    updateProfile() {
      this.updateUser();
      this.updateAvatar();
      alert("Your profile succesfully updated");
    },

    async getUser() {
      const res = await fetch(
        `http://localhost:3000/user/id/${this.$route.params.id}`
      );
      const data = await res.json();
      this.user = data;
      this.displayUser = data.username;
    },
    async updateUser() {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.user.username,
          twoFA: this.user.twoFA,
        }),
      };
      await fetch(
        `http://localhost:3000/user/${this.$route.params.id}/update-settings`,
        requestOptions
      );
    },
    async updateAvatar() {
      console.log("hello from update avatar");
    },
  },
  /* data available when page loads */
  mounted() {
    this.getUser();
  },
};
</script>

<style>
.form-control {
  color: gray;
}
</style>
