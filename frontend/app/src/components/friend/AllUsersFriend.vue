<template>
  <div class="container box-styling">
    <h3>All players</h3>
    <input v-model="searchQuery" type="text" placeholder="Search player..." />
    <ul class="list-elements">
      <li v-for="player in searchedPlayers" :key="player.id">
        <span v-if="player.avatarUrl != undefined"
          ><img :src="player.avatarUrl" alt="Avatar" class="avatar"
        /></span>
        <span v-if="player.relation != undefined" class="player-name">
          <a :href="'/player/' + player.playerName">
            {{ player.playerName }}
          </a>
        </span>
        <button
          v-if="player.relation?.status == 'NONE'"
          @click="sendUtilsFriendRequest(props.userid, player, store)"
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
          @click="utilsUnfriend(player, store)"
        >
          Unfriend
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from "vue";
import { useFriendStore } from "@/stores/FriendStore";
import { sendUtilsFriendRequest, utilsUnfriend } from "./friendUtils";

const props = defineProps({
  userid: { type: Number, required: true },
});

const store = useFriendStore();
const searchQuery = ref("");

onBeforeMount(async () => {
  await store.updateUserList(props.userid);
});

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

/********************************************
 * at click, found in friendUtils.ts        *
 ********************************************/
</script>

<style scoped>
a:link {
  text-decoration: none;
}
.container {
  width: 50%;
  overflow-y: scroll;
}
.container input {
  margin: 20px;
}
.avatar {
  width: 50px;
  height: 50px;
}
.player-name {
  font-size: 18px;
  font-family: var(--arcade-font);
}
.pending {
  background: #ff7200;
}

button {
  padding: 3px;
  font-size: 18px;
}
.pending button:hover,
button:active {
  background: #ff7200;
}

.unfriend {
  background: #ff1818;
}

.list-elements li {
  height: 73.5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #2b2929b6;
  padding-left: 20px;
  padding-right: 20px;
  margin: 2px;
  border-radius: 4px;
}

h3 {
  margin-top: 20px;
}
</style>

<!-- https://softauthor.com/vuejs-composition-api-search-bar-using-computed-properties/ -->
