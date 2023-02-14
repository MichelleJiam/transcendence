<template>
  <section>
    <div v-for="msg of messages" :key="messages.id">
      <pre><b>{{ msg.userId.playerName }}</b>	<i style="font-size: 12px;">Posted at: {{ msg.formattedCreatedAt }}</i></pre>
      <p>{{ msg.body }}</p>
      <hr />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import apiRequest from "@/utils/apiRequest";
import { convertDateTime } from "@/utils/dateTime";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const chatroomId = route.params.id;
const userStore = useUserStore();

const messages = ref([]);
const backendurlMessages =
  "/chat/" + chatroomId + "/user/" + userStore.user.id + "/messages";

onMounted(async () => {
  await apiRequest(backendurlMessages, "get").then((response) => {
    messages.value = response.data; // returns the response data into the users variable which can then be used in the template
    for (const date of messages.value) {
      const dateTime = new Date(date.createdAt);
      date["formattedCreatedAt"] = convertDateTime(dateTime);
    }
  });
});
</script>
<style scoped>
* {
  box-sizing: border-box;
}
</style>
