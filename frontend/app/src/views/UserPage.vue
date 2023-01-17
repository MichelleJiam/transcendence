<!--
    this should be the main page layout
    so the basic nav bar and the content div
    then there should be different components that render
    on different circumstances
-->

<template>
  <main>
    <div id="display-content">
      <div class="user-info">
        <div>
          <h1 class="user-title">
            Hi
            <span class="playerName">{{
              store.accountSettings.playerName
            }}</span>
          </h1>
        </div>
        <AvatarDisplay class="user-avatar" :src="store.avatar.url" />
      </div>

      <div class="user-settings">
        <h2 class="user-setting-title">
          You can edit your account settings here.
        </h2>
        <!-- form is in avatar upload -->
        <div class="usersetting-forms">
          <AvatarUpload />

          <!-- form is not in the component -->
          <form action="#!">
            <InputText
              id="playerName"
              v-model="playerName"
              label="Player Name: "
              :value="playerName"
            />

            <span class="validate">
              <i>{{ message }}</i>
            </span>
            <InputCheckbox
              id="twoFactorAuthentication"
              v-model:checked="twoFactorAuthentication"
              label="Two-factor authentication: "
            />

            <button :disabled="isDisabled" @click="submitAccountSettings">
              Update account settings
            </button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import InputText from "@/components/InputText.vue";
import InputCheckbox from "@/components/InputCheckbox.vue";
import AvatarDisplay from "@/components/AvatarDisplay.vue";
import AvatarUpload from "@/components/AvatarUpload.vue";
import { useAccountSettings } from "@/stores/AccountSettings";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const twoFactorAuthentication = ref<boolean>();
const playerName = ref<string>("");
const isDisabled = ref<boolean>();

let message = "";

const route = useRoute();
const store = useAccountSettings();

store.setUserId(route.params.id); // temporary workaround: remove when user authentication is fixed

onMounted(async () => {
  await store.getAccountSettings();
  twoFactorAuthentication.value = store.accountSettings.twoFA;
  playerName.value = store.accountSettings.playerName;
  await store.getAvatar();
});

function submitAccountSettings() {
  store.updateAccountSettings(playerName.value, twoFactorAuthentication.value);
}

/*  client-Side input validation */

watch(playerName, () => {
  if (playerName.value.length <= 3 || playerName.value.length > 8) {
    message = "Player name must be between 3 and 8 characters";
    isDisabled.value = true;
  } else if (!validPlayerName(playerName.value)) {
    message =
      "Player name can only include alphabetic characters, digits and the following special characters -_";
    isDisabled.value = true;
  } else {
    message = "";
    isDisabled.value = false;
  }
});

function validPlayerName(playerName: string) {
  return /^[a-zA-Z0-9-_!]+$/.test(playerName);
}
</script>

<style scoped>
.validate {
  color: #da14ff;
}

.playerName {
  color: #39ff14;
}

#display-content {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 25px;
  height: auto;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-grow: 1;
}
.user-title {
  margin-bottom: 20px;
  font-size: 6em;
}

.user-avatar {
  border-radius: 50%;
  border: 5px solid #39ff14;
  align-self: center;
}

.user-settings {
  display: flex;
  flex-direction: column;
  flex-grow: 3;
  /* justify-content: space-evenly; */
}

.usersetting-forms {
  display: flex;
  flex-direction: column;
  align-items: stretch;

  justify-content: space-evenly;
}

.user-setting-title {
  margin-bottom: 20px;
  font-size: 3em;
}
</style>
