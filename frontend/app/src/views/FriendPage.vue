<!--
    this should be the main page layout
    so the basic nav bar and the content div
    then there should be different components that render
    on different circumstances
-->

<template>
  <main>
    <div id="display-content">
      <h1>Players</h1>
      <div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search player..."
        />
        <hr />
      </div>
      <!-- class attribute can be added to style element -->
      <div v-for="player in searchedPlayers" :key="player.id">
        {{ player.playerName }}
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
        <!-- start conditional rendering button -->
        <button
          v-if="player.relation == 'NONE' || player.relation == undefined"
          @click="sendFriendRequest(player)"
        >
          Add friend
        </button>
        <button
          v-else-if="player.relation == 'PENDING'"
          class="pending"
          disabled
        >
          Pending request
        </button>
        <button v-else style="background-color: red">Unfriend</button>
        <!-- end conditional rendering button -->
        <hr />
      </div>

      <div style="margin-top: 50px">
        <h2>Friend list</h2>

        <!-- LEFT OFF HERE!! maybe make one function to check for friend and pending? -->

        <div v-if="hasFriends()">
          <div v-for="friend in friendList" :key="friend.id">
            {{ friend.playerName }}
            <button>Unfriend</button>
          </div>
        </div>
        <div v-else>No friends</div>
      </div>

      <div style="margin-top: 50px">
        <h2>Pending</h2>
        <div v-for="pending in pendingList" :key="pending.id">
          {{ pending.playerName }}
          <button>Accept</button>
          <button>Deny</button>
        </div>
      </div>

      <!-- <div style="margin-top: 50px">
        <h2>Friend list</h2>
        <p v-if="friendList.length == 0"><i>No friends</i></p>
        <p v-for="friend in friendList" v-else :key="friend.id">
          {{ friend.playerName }}
        </p>
      </div> -->
    </div>
  </main>
</template>

<script setup lang="ts">
import apiRequest from "@/utils/apiRequest";
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";

/* temporary workaround: remove when user authentication is fixed */
const route = useRoute();
const userId = route.params.id;

const socket = io("http://localhost:3000/friend");

type User = {
  id: number;
  playerName: string;
  status: string;
  /* in relation to the current user */
  relation: string;
};

const users = ref(Array<User>());
const searchQuery = ref("");

onMounted(async () => {
  socket.on("connect", () => {
    console.log(
      socket.id + " user",
      userId,
      "connected to socket on FriendPage"
    );
  });

  await updateUserList();
});

socket.on("friendRequest", async (data) => {
  if (data.target == userId) {
    await updateUserList();
    alert("You have a new friend request!");
  }
});

/* fetch all users from the database */
async function updateUserList() {
  const res = await apiRequest("/user/", "get");
  users.value = res.data;
  await updateStatus();
}

async function checkFriendshipStatus(player: User) {
  const res = await apiRequest(
    `/friend/relation/${userId}/${player.id}`,
    "get"
  );
  player.relation = res.data;
}

async function updateStatus() {
  for (let i = 0; i < users.value.length; i++) {
    await checkFriendshipStatus(users.value[i]);
  }
}

// async function updateFriendList() {
//   const res = await apiRequest(`/friend/${userId}`, "get");
//   friendList.value = res.data;
// }

function hasFriends() {
  const friends = users.value.filter((player) => {
    if (player.relation == "FRIEND") {
      return player.playerName;
    }
  });
  if (friends.length == 0) return false;
  return true;
}

const friendList = computed(() => {
  return users.value.filter((player) => {
    if (player.relation == "FRIEND") {
      return player.playerName;
    }
  });
});

const pendingList = computed(() => {
  return users.value.filter((player) => {
    if (player.relation == "PENDING") {
      return player.playerName;
    }
  });
});

/* called twice, i think when the app is created, how to fix?
it's also the reason i check for undefined when rendering the button,
the first time around it's undefined and you see a glimpse of the
red "unfriend" button. Now the button "pending" is added you also
see a glimpse of the "add friend" button on the first time around */
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
    // await updateFriendList();
    await updateStatus();
    alert("Friend request send");
  } else console.log("No user id provided in url");
}
</script>

<style scoped>
.dot {
  height: 25px;
  width: 25px;
  border-radius: 50%;
}

.pending {
  background-color: orange;
}
</style>

<!-- https://softauthor.com/vuejs-composition-api-search-bar-using-computed-properties/ -->
