<template>
  <div class="container">
    <input v-model="searchQuery" type="text" placeholder="Search player..." />
    <ul class="list-group">
      <li v-for="player in searchedPlayers" :key="player.id">
        <span><img :src="avatar" alt="Avatar" class="avatar" /></span>
        <span>{{ player.playerName }}</span>
        <button
          v-if="player.relation?.status == 'NONE'"
          @click="sendFriendRequest(player)"
        >
          Add friend
        </button>
        <button
          v-else-if="player.relation?.status == 'PENDING'"
          class="pending"
          disabled
        >
          Pending
        </button>
        <button
          v-else-if="player.relation?.status == 'FRIEND'"
          class="unfriend"
          @click="unfriend(player)"
        >
          Unfriend
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import apiRequest from "@/utils/apiRequest";
import { ref, computed } from "vue";
import { useFriendStore, type User } from "@/stores/FriendStore";
import { useAccountSettings } from "@/stores/AccountSettings";

const props = defineProps({
  userid: { type: String, required: true },
});

const store = useFriendStore();
const storeAccount = useAccountSettings();

const avatar = new URL("../assets/default-avatar.svg", import.meta.url).href;
const searchQuery = ref("");

await store.updateUserList(props.userid);

/**********************
 * computed properties *
 **********************/

const searchedPlayers = computed(() => {
  return store.users.filter((player) => {
    if (player.playerName && player.id != Number(props.userid)) {
      return (
        player.playerName
          .toUpperCase()
          .toLowerCase()
          .indexOf(searchQuery.value.toLowerCase()) != -1
      );
    }
  });
});

/***********
 * at click *
 ***********/

async function sendFriendRequest(player: User) {
  if (props.userid) {
    try {
      await apiRequest("/friend/request", "post", {
        data: {
          source: props.userid,
          target: player.id,
          status: "PENDING",
        },
      });
    } catch (error) {
      console.log(error);
      return;
    }
    await store.updateUserList(props.userid);
  } else console.log("No user id provided in url");
}

async function unfriend(player: User) {
  await store.removeRelation(player);
  await store.updateUserList(props.userid);
}
</script>

<style scoped>
.container {
  width: 50%;
  max-height: 505px;
  min-height: 505px;
  overflow-y: scroll;
  box-shadow: rgba(0, 0, 0, 10) 0px 1px 4px;
  margin-bottom: 40px;
}

.container input {
  margin: 20px;
}

.list-group {
  list-style: none;
}

.list-group li {
  padding: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 95px;
  background-color: #3d2c2c;
  margin: 10px 30px 10px 10px;
}

.avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.pending {
  background: #ff7200;
}
.pending button:hover,
button:active {
  background: #ff7200;
}

.unfriend {
  background: #ff1818;
}

:disabled {
  /* opacity: 0.3; */
  cursor: progress;
  /* cursor: url("../assets/accept.svg"), auto; */
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: #39ff14;
}
</style>
