<template>
  <main>
    <div id="display-content">
      <div class="row">
        <div class="header">
          <h2>{{ chatRoomInfo.chatroomName }}</h2>
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
              <GetChatUsers></GetChatUsers>
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
            v-if="isCurrentUserOwner == true"
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
import apiRequest from "@/utils/apiRequest";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const chatroomId = route.params.id;
const chatRoomInfo = ref([]);
const showModal = ref<boolean>(false);
const userStore = useUserStore();
const isCurrentUserOwner = ref<boolean>(false);

const backendurlChatName = "/chat/" + chatroomId;

function close() {
  showModal.value = false;
}

onMounted(async () => {
  await apiRequest(backendurlChatName, "get").then((response) => {
    chatRoomInfo.value = response.data; // returns the response data into the users variable which can then be used in the template
    if (chatRoomInfo.value.owner.id == userStore.user.id)
      isCurrentUserOwner.value = true;
  });
});
</script>

<style scoped>
* {
  box-sizing: border-box;
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
  float: center;
  width: 70%;
}

.settings {
  float: center;
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
</style>
