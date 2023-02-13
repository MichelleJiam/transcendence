<template>
  <div class="container">
    <h3>Pending requests</h3>
    <ul class="list-group">
      <div>
        <p v-if="store.isLoading">Loading...</p>
        <li v-for="pending in pendingList" :key="pending.id">
          <span
            ><img :src="pending.avatarUrl" alt="Avatar" class="avatar"
          /></span>
          <span>{{ pending.playerName }}</span>
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
  userid: { type: String, required: true },
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
.container {
  margin-top: 20px;
  width: 50%;
  max-height: 505px;
  min-height: 505px;
  overflow-y: scroll;
  box-shadow: rgba(0, 0, 0, 10) 0px 1px 4px;
}

.container h3 {
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

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: #39ff14;
}
</style>
