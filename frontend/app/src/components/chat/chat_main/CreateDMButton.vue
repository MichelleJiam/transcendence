<template>
  <section><button @click="createDMDto()">create DM</button></section>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { CreateDMDto } from "@/components/chat/chatUtils";
import { useRoute } from "vue-router";
import apiRequest, { baseUrl } from "@/utils/apiRequest";
import { ref } from "vue";

// maybe you can use a prop for this?

const userStore = useUserStore();
const route = useRoute();
const otherUserName = String(route.params.username); // assuming: /:username
const createDM = new CreateDMDto();
createDM.user = userStore.user.id;
createDM.chatroomName =
  userStore.user.playerName + " " + otherUserName + " DMs";

const otherUser = ref();

function createDMDto() {
  const url = baseUrl + "/user/player/" + otherUserName;
  apiRequest(url, "get")
    .then((response) => {
      otherUser.value = response.data;
      createDM.otherUser = otherUser.value.id;
      console.log(createDM);
      apiRequest("/chat/create", "post", { data: createDM })
        .then((response) => {
          console.log("/chat/", response.data.id);
          //   location.href = "/chat/" + response.data.id;
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.error(err);
    });
}
</script>
