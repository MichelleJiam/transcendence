<template>
  <div class="chat-message-box scroll-y">
    <h2>Owner of the chat</h2>
    <div class="roles">
      <a :href="'/player/' + ownerName"> {{ ownerName }} 👑 </a>
    </div>
    <h2>Admins of the chat</h2>
    <div v-if="chatRoomInfo.type != 'DM'" class="roles">
      <div v-for="admin in chatRoomInfo.admin" :key="chatRoomInfo.admin.id">
        <p>
          <a :href="'/player/' + admin.playerName">
            {{ admin.playerName }}
            <span v-if="admin.isOwner == true">👑</span>
          </a>
          <br />
          <button
            v-if="
              isUserAdmin == true &&
              admin.isOwner == false &&
              admin.id != props.currentUserId
            "
            @click="deleteAdmin(chatRoomInfo.id, props.currentUserId, admin.id)"
          >
            delete admin
          </button>
          <button
            v-if="
              isUserOwner == true &&
              admin.isOwner == false &&
              admin.id != props.currentUserId
            "
            @click="swapOwner(chatRoomInfo.id, props.currentUserId, admin.id)"
          >
            make owner
          </button>
        </p>
      </div>
    </div>
    <h2>Members of the chat</h2>
    <div class="roles">
      <div v-for="member in chatRoomInfo.member" :key="chatRoomInfo.member.id">
        <p>
          <a :href="'/player/' + member.playerName">
            {{ member.playerName }}
            <span v-if="member.isOwner == true">👑</span>
          </a>
          <br />
          <button
            v-if="
              member.id != props.currentUserId &&
              inBlocklist(member.id) == false &&
              chatRoomInfo.type != 'DM'
            "
            @click="createBlock(props.currentUserId, member.id)"
          >
            block
          </button>
          <button
            v-if="
              member.id != props.currentUserId && inBlocklist(member.id) == true
            "
            @click="unBlock(props.currentUserId, member.id)"
          >
            unblock
          </button>
          <button
            v-if="
              (isUserAdmin == true || isUserOwner == true) &&
              member.isOwner == false &&
              member.id != props.currentUserId &&
              chatRoomInfo.type != 'DM'
            "
            @click="
              createPenalty(
                props.currentUserId,
                member.id,
                mute,
                chatRoomInfo.id
              )
            "
          >
            mute
          </button>
          <button
            v-if="
              (isUserAdmin == true || isUserOwner == true) &&
              member.isOwner == false &&
              member.id != props.currentUserId &&
              chatRoomInfo.type != 'DM'
            "
            @click="
              createPenalty(
                props.currentUserId,
                member.id,
                ban,
                chatRoomInfo.id
              )
            "
          >
            ban
          </button>
          <button
            v-if="
              (isUserAdmin == true || isUserOwner == true) &&
              member.isOwner == false &&
              member.id != props.currentUserId &&
              chatRoomInfo.type != 'DM'
            "
            @click="kickUser(props.chatroomId, props.currentUserId, member.id)"
          >
            kick
          </button>
          <button
            v-if="
              (isUserAdmin == true || isUserOwner == true) &&
              member.isAdmin == false &&
              member.id != props.currentUserId &&
              chatRoomInfo.type != 'DM'
            "
            @click="makeAdmin(chatRoomInfo.id, props.currentUserId, member.id)"
          >
            make admin
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import apiRequest, { baseUrl } from "@/utils/apiRequest";
import {
  createPenalty,
  makeAdmin,
  swapOwner,
  isOwner,
  isAdmin,
  deleteAdmin,
  isMember,
  AddMemberDto,
  kickUser,
  Blocklist,
} from "../chatUtils";
import { ref, onMounted } from "vue";
import { io } from "socket.io-client";

const props = defineProps({
  showContent: Boolean,
  currentUserId: { type: Number, required: true },
  chatroomId: { type: Number, required: true },
});

const mute = "mute";
const ban = "ban";

const backendurlChatName = "/chat/" + props.chatroomId;
const backendBlocklist = "/blocklist/user/" + props.currentUserId;

let ownerName: string;
const chatRoomInfo = ref([]);
const isUserOwner = ref();
const isUserAdmin = ref();
const blocklist = ref([]);

const socketUrl = baseUrl + "/penalty";
const socket = io(socketUrl);

onMounted(async () => {
  // *** setup view
  await setup();
  // *** Get user's blocklist
  await getBlocklist();

  if (
    props.showContent == true &&
    (await isMember(props.chatroomId, props.currentUserId)) == false &&
    chatRoomInfo.value.type != "password"
  ) {
    const addMemberUrl = "/chat/" + props.chatroomId + "/add/member";
    const addMemberDto = new AddMemberDto();
    addMemberDto.member = props.currentUserId;
    await apiRequest(addMemberUrl, "put", { data: addMemberDto })
      .then((response) => {
        chatRoomInfo.value = response.data;
        socket.emit("newUserState", props.chatroomId);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // *** auto kick people if banned
  socket.on("gotBanned", async (response) => {
    if (
      response.user == props.currentUserId &&
      props.chatroomId == response.chatroom &&
      response.penaltyType == "ban"
    ) {
      alert("Sorry, you've been banned, you can rejoin the chat in 2 minutes.");
      window.location.href = "/chat";
    } else {
      if (
        response.user == props.currentUserId &&
        props.chatroomId == response.chatroom &&
        response.penaltyType == "mute"
      ) {
        alert("You've been muted, you can reply again in 2 minutes.");
      }
      await setup();
    }
  });

  socket.on("userUpdate", async (payload: number) => {
    if (payload === props.chatroomId) {
      await setup();
    }
  });

  socket.on("kickedAUser", async (response) => {
    if (
      response.userId == props.currentUserId &&
      props.chatroomId == response.chatroomId
    ) {
      alert("Sorry, you've been kicked from the chat.");
      console.log("You've been kicked");
      window.location.href = "/chat";
    } else if (props.chatroomId === response.chatroomId) {
      await setup();
    }
  });
});

async function getBlocklist() {
  await apiRequest(backendBlocklist, "get")
    .then((response) => {
      blocklist.value = response.data;
    })
    .catch((err) => {
      console.error(err);
    });
}

async function setup(): Promise<void> {
  const ownerUrl =
    "/chat/" + props.chatroomId + "/is_owner/" + props.currentUserId;
  const adminUrl =
    "/chat/" + props.chatroomId + "/is_admin/" + props.currentUserId;

  // *** GET chatroom data and add user to member list if not in there yet
  await apiRequest(backendurlChatName, "get").then(async (response) => {
    chatRoomInfo.value = response.data;
    ownerName =
      response.data.owner.playerName ??
      "unnamedPlayer" + response.data.owner.id;
    for (const member of chatRoomInfo.value.member) {
      member["isOwner"] = await isOwner(props.chatroomId, member.id);
      member["isAdmin"] = await isAdmin(props.chatroomId, member.id);
      member.playerName = member.playerName ?? "unnamedPlayer" + member.id;
    }
    for (const admin of chatRoomInfo.value.admin) {
      admin["isOwner"] = await isOwner(props.chatroomId, admin.id);
      admin["isAdmin"] = await isAdmin(props.chatroomId, admin.id);
      admin.playerName = admin.playerName ?? "unnamedPlayer" + admin.id;
    }
  });

  // *** check if current user is Owner
  await apiRequest(ownerUrl, "get").then((response) => {
    isUserOwner.value = response.data;
  });

  // *** check if current user is Admin
  await apiRequest(adminUrl, "get").then((response) => {
    isUserAdmin.value = response.data;
  });
}

function inBlocklist(userId: number) {
  for (const entry of blocklist.value) {
    if (entry.blockedUser.id == userId) {
      return true;
    }
  }
  return false;
}

function createBlock(blocklistOwner: number, blockedUser: number) {
  const url = "/blocklist/create";

  const newBlocklist = new Blocklist();
  newBlocklist.blocklistOwner = blocklistOwner;
  newBlocklist.blockedUser = blockedUser;

  apiRequest(url, "post", { data: newBlocklist })
    .then((response) => {
      location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
}

function unBlock(blocklistOwner: number, blockedUser: number) {
  const url =
    "/blocklist/remove/owner/" + blocklistOwner + "/blocked/" + blockedUser;

  apiRequest(url, "delete")
    .then((response) => {
      location.reload();
    })
    .catch((err) => console.error(err));
}
</script>
<style scoped>
a:link {
  text-decoration: none;
}
button {
  width: 14%;
  height: 2%;
  font-size: 0.7rem;
  padding: 1% 1%;
  margin: 1% 1%;
}

.scroll-y {
  height: 38rem;
  overflow-y: auto;
}

.roles {
  margin: 2% 4%;
}

h2 {
  padding: 2% 1%;
}

p {
  padding: 1% 2%;
}
</style>
