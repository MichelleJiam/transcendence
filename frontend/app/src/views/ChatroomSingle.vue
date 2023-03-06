<template>
  <main>
    <div v-if="showContent == true" id="display-content">
      <div class="row">
        <div class="header">
          <h2>{{ chatRoomInfo.chatroomName }}</h2>
          <span v-if="isDM == true">
            <suspense>
              <template #default>
                <InviteToGame :player-two="DMMemberTwo"></InviteToGame>
              </template>
              <template #fallback><p>loading...</p></template>
            </suspense>
          </span>
          <span v-if="isPrivate == true">
            <input id="link" class="linkurl" type="text" :value="routeUrl" />
            <div class="tooltip">
              <button class="copy" @click="copyUrl()" @mouseout="outCopy()">
                <span id="myTooltip" class="tooltiptext">
                  {{ copyUrlText }}</span
                >
                Copy
              </button>
            </div>
          </span>
          <span v-if="isPassword == true">
            <Teleport to="body">
              <!-- use the modal component, pass in the prop -->
              <PasswordModal :show="showPassword" @close="showPassword = false">
              </PasswordModal> </Teleport
          ></span>
        </div>
        <div class="leave">
          <suspense>
            <template #default>
              <LeaveChat></LeaveChat>
            </template>
            <template #fallback><p>loading...</p></template>
          </suspense>
        </div>
      </div>
      <div class="row">
        <div class="column">
          <div class="sub">
            <suspense>
              <template #default>
                <GetSingleChatroomMessages></GetSingleChatroomMessages>
              </template>
              <template #fallback><p>loading...</p></template>
            </suspense>
          </div>
        </div>
        <div class="columnright">
          <suspense>
            <template #default>
              <GetChatUsers :show-content="showContent"></GetChatUsers>
            </template>
            <template #fallback><p>loading...</p></template>
          </suspense>
        </div>
      </div>
      <div class="row">
        <div class="header post">
          <PostMessages></PostMessages>
        </div>
        <div class="leave settings">
          <button
            v-if="isCurrentUserOwner == true && chatRoomInfo.type == 'password'"
            id="show-modal"
            @click="showModal = true"
          >
            Settings
          </button>

          <Teleport to="body">
            <!-- use the modal component, pass in the prop -->
            <EditChatroomInfoVue :show="showModal" @close="close()">
            </EditChatroomInfoVue>
          </Teleport>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import EditChatroomInfoVue from "@/components/chat/single_chatroom/EditChatroomInfo.vue";
import GetChatUsers from "@/components/chat/single_chatroom/GetChatUsers.vue";
import GetSingleChatroomMessages from "@/components/chat/single_chatroom/message/GetSingleChatroomMessages.vue";
import LeaveChat from "@/components/chat/single_chatroom/LeaveChat.vue";
import PostMessages from "@/components/chat/single_chatroom/message/PostMessages.vue";
import { useUserStore } from "@/stores/UserStore";
import apiRequest, { frontendUrl } from "@/utils/apiRequest";
import { ref, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import PasswordModal from "@/components/chat/single_chatroom/PasswordModal.vue";
import InviteToGame from "@/components/chat/single_chatroom/InviteToGame.vue";

const route = useRoute();
const routeUrl = frontendUrl + route.path;
const chatroomId = route.params.id;
const chatRoomInfo = ref([]);
const showModal = ref<boolean>(false);
const showPassword = ref<boolean>(false);
const userStore = useUserStore();
const isCurrentUserOwner = ref<boolean>(false);
const isPrivate = ref<boolean>(false);
const isPassword = ref<boolean>(false);
const isDM = ref<boolean>(false);
const showContent = ref<boolean>(false);

// for DM, in order to create the invite to game button
const DMMemberTwo = ref<number>();

const backendurlChatName = "/chat/" + chatroomId;

const copyUrlText = ref<string>("Copy to clipboard");

function close() {
  showModal.value = false;
}

function copyUrl() {
  navigator.clipboard.writeText(routeUrl);
  copyUrlText.value = "Copied: " + routeUrl;
}

function outCopy() {
  copyUrlText.value = "Copy to Clipboard";
}

onBeforeMount(async () => {
  const isUserBannedUrl =
    "/penalty/chatroom/" +
    chatroomId +
    "/user/" +
    userStore.user.id +
    "/banned";
  await apiRequest(isUserBannedUrl, "get")
    .then(async (response) => {
      console.log("are you banned? ", response.data);
      if (response.data == true) {
        alert("You are unable to join this chat.");
        window.location.href = "/chat";
      } else {
        await setup();
      }
    })
    .catch((err) => {
      console.error(err);
    });
});

async function setup() {
  await apiRequest(backendurlChatName, "get")
    .then((response) => {
      chatRoomInfo.value = response.data; // returns the response data into the users variable which can then be used in the template
      if (chatRoomInfo.value.owner.id == userStore.user.id)
        isCurrentUserOwner.value = true;
      if (chatRoomInfo.value.type === "private") isPrivate.value = true;
      if (chatRoomInfo.value.type === "password") isPassword.value = true;
      if (chatRoomInfo.value.type === "DM") isDM.value = true;
      showPassword.value = true;
      if (response.data.type === "DM") {
        for (const member of response.data.member) {
          if (member.id == userStore.user.id) {
            showContent.value = true;
          } else {
            DMMemberTwo.value = member.id;
          }
        }
        if (showContent.value == true) return;
        alert("You don't have access to this DM.");
        window.location.href = "/chat";
      } else {
        showContent.value = true;
      }
    })
    .catch((err) => {
      alert("This chat does not exists.");
      window.location.href = "/chat";
    });
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.linkurl {
  height: 1rem;
  width: 20rem;
  font-size: 1rem;
}

.copy {
  height: 2rem;
  width: 4rem;
  font-size: 1rem;
  margin-left: 0.5rem;
}
.header {
  float: left;
  width: 70%;
  padding: 10px;
  text-align: center;
}

.leave {
  float: left;
  width: 30%;
  text-align: right;
  padding: 1rem;
}

.post {
  width: 70%;
}

.settings {
  width: 30%;
}

/* Create two equal columns that floats next to each other */
.column {
  float: left;
  width: 70%;
  padding: 10px;
  height: 40rem;
  overflow-y: auto;
  transform: rotateX(180deg);
  -moz-transform: rotateX(180deg); /* Mozilla */
  -webkit-transform: rotateX(180deg); /* Safari and Chrome */
  -ms-transform: rotateX(180deg); /* IE 9+ */
  -o-transform: rotateX(180deg); /* Opera */
}

.sub {
  transform: rotateX(180deg);
  -moz-transform: rotateX(180deg); /* Mozilla */
  -webkit-transform: rotateX(180deg); /* Safari and Chrome */
  -ms-transform: rotateX(180deg); /* IE 9+ */
  -o-transform: rotateX(180deg); /* Opera */
}

.columnright {
  float: right;
  width: 30%;
  padding: 10px;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
</style>
<style scoped>
h2 {
  font-size: 3rem;
}

.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 20rem;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 1rem;
  padding: 1rem;
  position: absolute;
  z-index: 1;
  bottom: 150%;
  left: 50%;
  margin-left: -4rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 4.5rem; /* little arrow thingie */
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>
