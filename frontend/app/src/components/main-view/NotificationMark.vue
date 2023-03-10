<template>
  <section>
    <span v-if="status == false" title="ping pong"
      ><font-awesome class="font-awesome" icon="table-tennis-paddle-ball"
    /></span>
    <span v-if="status == true" title="You have pending friend request!"
      ><a href="/friends"
        ><font-awesome class="font-awesome" icon="fa-solid fa-comment" /></a
    ></span>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import apiRequest from "@/utils/apiRequest";
import { ref, onMounted } from "vue";

const userStore = useUserStore();
const status = ref<boolean>(false);
const friends = ref([]);

onMounted(async () => {
  await apiRequest("/friend", "get").then((response) => {
    friends.value = response.data;
    if (response.data.length > 0) {
      for (const friend of friends.value) {
        if (
          friend.source == userStore.user.id ||
          friend.target == userStore.user.id
        ) {
          if (friend.status == "PENDING") {
            status.value = true;
            console.log("There is a pending request");
            return;
          }
        }
      }
    }
  });
});
</script>
<style scoped>
.paddle-div {
  display: flex;
  align-items: center;
  justify-content: center;
}

.font-awesome {
  font-size: 50px;
}
</style>
