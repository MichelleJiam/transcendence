<template>
  <div class="container">
    <h3>Pending requests</h3>
    <ul class="list-group">
      <li v-for="pending in pendingList" :key="pending.id">
        <span><img :src="avatar" alt="Avatar" class="avatar" /></span>
        <span>{{ pending.playerName }}</span>
        <button v-if="Number(userId) == pending.relation?.target">
          Accept
        </button>
        <button v-if="Number(userId) == pending.relation?.target">
          Accept
        </button>
        <button v-else-if="Number(userId) == pending.relation?.source">
          Cancel
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import apiRequest from "@/utils/apiRequest";
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useFriendStore, type User } from "@/stores/FriendStore";

const store = useFriendStore();

const route = useRoute();
const userId = route.params.id;

const avatar = new URL("../assets/default-avatar.svg", import.meta.url).href;

onMounted(async () => {
  await store.updateUserList(userId);
});

const pendingList = computed(() => {
  return store.users.filter((player) => {
    if (player.relation?.status == "PENDING") {
      return player.playerName;
    }
  });
});
</script>

<style scoped>
.container {
  margin-top: 20px;
  width: 35%;
  max-height: 505px;
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

.pending {
  background: orange;
}
.pending button:hover,
button:active {
  background: orange;
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
