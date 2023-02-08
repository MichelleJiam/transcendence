<template>
  <main>
    <div id="display-content">
      <div v-if="users.length > 0">
        <h1>Players</h1>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search player..."
        />
        <hr />
        <div v-for="player in searchedPlayers" :key="player.id">
          <div
            class="dot"
            :style="[
              player.status === 'offline'
                ? { 'background-color': 'red' }
                : player.status === 'online'
                ? { 'background-color': 'green' }
                : { 'background-color': 'orange' },
            ]"
          ></div>
          {{ player.playerName }}
          <button
            v-if="player.relation?.status == 'NONE'"
            @click="sendFriendRequest(player)"
          >
            Add friend
          </button>
          <button v-else-if="player.relation?.status == 'PENDING'" disabled>
            Pending request
          </button>
          <input
            v-else-if="player.relation?.status == 'FRIEND'"
            type="image"
            :src="unfriendBtn"
            @click="unfriend()"
          />
          <hr />
        </div>
        <div style="margin-top: 50px">
          <h2>Friend list</h2>
          <div v-for="friend in friendList" :key="friend.id">
            {{ friend.playerName }}
          </div>
        </div>
        <div style="margin-top: 50px">
          <h2>Pending</h2>
        </div>
        <div v-for="pending in pendingList" :key="pending.id">
          {{ pending.playerName }}
          <button @click="acceptRequest(pending)">Accept</button>
        </div>
        <!-- end users.length -->
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import apiRequest from "@/utils/apiRequest";
import { computed, onBeforeMount, onMounted } from "vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000/friend");

const route = useRoute();
const userId = route.params.id;

const unfriendBtn = new URL("../assets/unfriend.png", import.meta.url).href;

const users = ref(Array<User>());
const searchQuery = ref("");

type Relation = {
  source: number;
  target: number;
  status: string /* FRIEND | PENDING | NONE */;
};

type User = {
  id: number;
  playerName: string;
  status: string /* ONLINE | OFFLINE | GAME */;
  relation: Relation /* in relation to the current user */;
};

onBeforeMount(async () => {
  await updateUserList();
});

onMounted(async () => {
  socket.on("connect", () => {
    console.log(
      socket.id + " user",
      userId,
      "connected to socket on FriendPage"
    );
  });
});

socket.on("friendRequest", async (data) => {
  if (data.target == userId) {
    await updateUserList();
    alert("You have a new friend request!");
  }
});

socket.on("requestAccepted", async (data) => {
  if (data.source == userId) {
    await updateUserList();
    alert("Someone accepted your friend request");
  }
});

/* fetch all users from the database and their relation with the current user */
async function updateUserList() {
  const res = await apiRequest("/friend/relation/users", "get");
  users.value = res.data;
  users.value.forEach(async (user) => {
    const res = await apiRequest(
      `/friend/relation/${userId}/${user.id}`,
      "get"
    );
    user.relation = res.data;
  });
}

/**********************
 * computed properties *
 **********************/

const searchedPlayers = computed(() => {
  return users.value.filter((player) => {
    if (player.playerName && player.id != Number(userId)) {
      return (
        player.playerName
          .toUpperCase()
          .toLowerCase()
          .indexOf(searchQuery.value.toLowerCase()) != -1
      );
    }
  });
});

const pendingList = computed(() => {
  return users.value.filter((player) => {
    if (
      Number(userId) == player.relation?.target &&
      player.relation?.status == "PENDING"
    ) {
      return player.playerName;
    }
  });
});

const friendList = computed(() => {
  return users.value.filter((player) => {
    if (player.relation?.status == "FRIEND") {
      return player.playerName;
    }
  });
});

/***********
 * at click *
 ***********/

async function sendFriendRequest(player: User) {
  if (userId) {
    try {
      await apiRequest("/friend/request", "post", {
        data: {
          source: userId,
          target: player.id,
          status: "PENDING",
        },
      });
    } catch (error) {
      console.log(error);
      return;
    }
    await updateUserList();
    alert("Friend request send");
  } else console.log("No user id provided in url");
}

async function acceptRequest(player: User) {
  await apiRequest("/friend/accept", "put", {
    data: player.relation,
  });
  await updateUserList();
}

async function unfriend() {
  console.log("unfriend");
}
</script>

<!-- css -->

<style scoped>
.dot {
  height: 25px;
  width: 25px;
  border-radius: 50%;
}

button:disabled,
button[disabled] {
  background-color: orange;
  cursor: not-allowed;
}
</style>

<!-- https://softauthor.com/vuejs-composition-api-search-bar-using-computed-properties/ -->
