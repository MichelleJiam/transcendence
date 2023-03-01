<template>
  <section><button @click="createDMDto()">create DM</button></section>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { CreateDMDto } from "@/components/chat/chatUtils";
import apiRequest from "@/utils/apiRequest";
import { ref } from "vue";

// maybe you can use a prop for this?
const props = defineProps({
  otherPlayer: Number,
});

const userStore = useUserStore();
const otherUserName = ref();
const createDM = new CreateDMDto();
createDM.user = userStore.user.id;

async function createDMDto() {
  if (props.otherPlayer != undefined) {
    createDM.otherUser = props.otherPlayer;
    await apiRequest(
      "/chat/DM/" + createDM.user + "/" + createDM.otherUser,
      "get"
    )
      .then(async (response) => {
        if (response.data.id != undefined) {
          location.href = "/chat/" + response.data.id;
          return;
        } else {
          const findOtherPlayerNameUrl = "/user/" + props.otherPlayer;
          await apiRequest(findOtherPlayerNameUrl, "get")
            .then(async (response) => {
              otherUserName.value = response.data;
              createDM.chatroomName =
                userStore.user.playerName +
                " and " +
                otherUserName.value.playerName +
                " DMs";
              await apiRequest("/chat/create", "post", { data: createDM })
                .then((response) => {
                  console.log(response);
                  location.href = "/chat/" + response.data.id;
                  return;
                })
                .catch((err) => {
                  console.error(err);
                });
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
  }
}
</script>
