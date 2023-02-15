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
          <EditChatroomInfoVue></EditChatroomInfoVue>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import EditChatroomInfoVue from "@/components/chat/EditChatroomInfo.vue";
import GetChatUsers from "@/components/chat/GetChatUsers.vue";
import GetSingleChatroomMessages from "@/components/chat/GetSingleChatroomMessages.vue";
import LeaveChat from "@/components/chat/LeaveChat.vue";
import apiRequest from "@/utils/apiRequest";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const chatroomId = route.params.id;
const chatRoomInfo = ref([]);

const backendurlChatName = "/chat/" + chatroomId;

onMounted(async () => {
  await apiRequest(backendurlChatName, "get").then((response) => {
    chatRoomInfo.value = response.data; // returns the response data into the users variable which can then be used in the template
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
