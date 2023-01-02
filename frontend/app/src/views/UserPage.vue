<!--
    this should be the main page layout
    so the basic nav bar and the content div
    then there should be different components that render
    on different circumstances
-->

<template>
  <main>
    <div id="display-content">
      <h1>
        Hi <span class="username">{{ store.accountSettings.username }}</span>
      </h1>
      <h2>You can edit your account settings here.</h2>

      <!-- start avatar related stuff, split into components when working -->

      <img class="avatar" :src="store.avatar.url" alt="Avatar" />
      <form>
        <div>
          <label>Avatar: </label>
          <input type="file" @change="onFileSelected($event)" />
        </div>
        <button
          :disabled="isDisabledAvatar"
          style="margin-bottom: 50px"
          @click="submitAvatar"
        >
          Update avatar
        </button>

        <!-- end avatar related stuff, split into components when working -->

        <InputText
          id="username"
          v-model="username"
          label="Username: "
          :value="username"
        />
        <span class="validate">
          <i>{{ message }}</i>
        </span>
        <InputCheckbox
          id="twoFactorAuthentication"
          v-model:checked="twoFactorAuthentication"
          label="Two-factor authentication: "
        />
        <InputText
          id="email"
          label="Email: "
          :placeholder="store.accountSettings.email"
          :disabled="true"
        />
      </form>
      <button :disabled="isDisabled" @click="submitAccountSettings">
        Update account settings
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import InputText from "@/components/InputText.vue";
import InputCheckbox from "@/components/InputCheckbox.vue";
import { useAccountSettings } from "@/stores/AccountSettings";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { apiRequest } from "@/utils/apiRequest";
import axios from "axios";

const twoFactorAuthentication = ref<boolean>();
const username = ref<string>("");
const isDisabled = ref<boolean>();
const isDisabledAvatar = ref<boolean>(true);
let fileName: string | undefined;

let message = "";

const route = useRoute();
const store = useAccountSettings();

store.setUserId(route.params.id); // temporary workaround: remove when user authentication is fixed

onMounted(async () => {
  await store.getAccountSettings();
  twoFactorAuthentication.value = store.accountSettings.twoFA;
  username.value = store.accountSettings.username;
  await store.getAvatar();
});

function submitAccountSettings() {
  store.updateAccountSettings(username.value, twoFactorAuthentication.value);
}

/*  client-Side input validation */

watch(username, () => {
  if (username.value.length <= 3 || username.value.length > 8) {
    message = "Username must be between 3 and 8 characters";
    isDisabled.value = true;
  } else if (!validUsername(username.value)) {
    message =
      "Username can only include alphabetic characters, digits and the following special characters -_";
    isDisabled.value = true;
  } else {
    message = "";
    isDisabled.value = false;
  }
});

function validUsername(username: string) {
  return /^[a-zA-Z0-9-_!]+$/.test(username);
}

async function onFileSelected(e: Event) {
  const formData = new FormData();

  formData.append("file", "yooooo");

  axios({
    method: "post",
    url: `http://localhost:3000/user/${route.params.id}/avatar`,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((response) => {
      console.log(response);
    })
    .catch((response) => {
      console.log(response);
    });

  // const target = e.target as HTMLInputElement;
  // fileName = target.files?.item(0)?.name;
  // const formData = new FormData();
  // if (typeof fileName === "string") {
  //   formData.append("file", fileName);
  // }
  // console.log("type = ", typeof formData);
  // const res = await axios({
  //   method: "post",
  //   url: `http://localhost:3000/user/${route.params.id}/avatar`,
  //   data: formData,
  //   headers: {
  //     "Content-Type": "multipart/form-data",
  //   },
  // });
  // console.log("res = ", res);
  // try {
  //   apiRequest(`/user/${route.params.id}/avatar`, "post", {
  //     data: { formData },
  //   });
  //   console.log("seems like it worked?");
  // } catch (error) {
  //   console.log(`Error in updateAvatar(): ${error}`);
  // }
  // validate file before disabling the button
  // implement option of setting back the default avatar?
  isDisabledAvatar.value = false;
}

// const res = await axios.post('//localhost:5001/upload', formData, {
//   headers: {
//     'Content-Type': 'multipart/form-data'
//   }
// });

function submitAvatar() {
  // try {
  //   apiRequest(`/user/${route.params.id}/avatar`, "post", {
  //     data: { formData },
  //   });
  //   console.log("seems like it worked?");
  // } catch (error) {
  //   console.log(`Error in updateAvatar(): ${error}`);
  // }
  // store.updateAvatar(fileName);
}
</script>

<style scoped>
h1 {
  font-size: 8rem;
}

.validate {
  color: red;
}

.username {
  color: #39ff14;
}

.avatar {
  width: 250px;
  height: 250px;
}
</style>
