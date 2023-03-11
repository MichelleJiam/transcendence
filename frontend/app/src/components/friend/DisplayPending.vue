<template>
  <div class="container box-styling">
    <h3>Pending requests</h3>
    <ul class="list-elements">
      <div>
        <p v-if="store.isLoading">Loading...</p>
        <li v-for="pending in pendingList" :key="pending.id">
          <span
            ><img :src="pending.avatarUrl" alt="Avatar" class="avatar"
          /></span>
          <span class="player-name">
            <a :href="'/player/' + pending.playerName">
              {{ pending.playerName }}
            </a>
          </span>
          <div v-if="Number(userid) == pending.relation?.target">
            <button style="margin-right: 20px" @click="acceptRequest(pending)">
              Accept
            </button>
            <button @click="denyRequest(pending)">Deny</button>
          </div>
          <button
            v-else-if="Number(userid) == pending.relation?.source"
            @click="cancelRequest(pending)"
          >
            Cancel
          </button>
        </li>
      </div>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useFriendStore, type User } from "@/stores/FriendStore";

const props = defineProps({
  userid: { type: Number, required: true },
});

const store = useFriendStore();

/**********************
 * computed properties *
 **********************/

const pendingList = computed(() => {
  return store.users.filter((player) => {
    if (player.relation?.status == "PENDING") {
      return player.playerName;
    }
  });
});

/***********
 * at click *
 ***********/

async function cancelRequest(player: User) {
  await store.removeRelation(player);
  // await store.updateUserList(props.userid);
}

async function acceptRequest(player: User) {
  await store.acceptRequest(player);
  await store.updateUserList(props.userid);
}

async function denyRequest(player: User) {
  await store.removeRelation(player);
}
</script>

<style scoped>
a:link {
  text-decoration: none;
}
.container {
  width: 50%;
  overflow-y: scroll;
}

.container h3 {
  margin: 20px;
}

.player-name {
  font-size: 18px;
  font-family: var(--arcade-font);
}

button {
  padding: 3px;
  font-size: 18px;
}
.avatar {
  width: 50px;
  height: 50px;
}
</style>
