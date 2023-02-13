<template>
  <section>
    <form @submit.prevent="editChat(2)">
      <!-- change this to cookie user id-->
      <div>
        select type of chat:<br />
        <label for="type">Choose a chat type:</label>
        <select id="type" v-model="updateChatroomDto.type" name="type">
          <option value="public" selected>public</option>
          <option value="private">private</option>
          <option value="password">password</option>
        </select>
      </div>
      <div>
        <label for="chatroomName">Name the chat:</label>
        <input
          id="chatroomName"
          v-model="updateChatroomDto.chatroomName"
          type="text"
        />
      </div>
      <div>
        <label for="password">Update password:</label>
        <input id="password" v-model="updateChatroomDto.password" type="text" />
      </div>
      <button>Update chat</button>
    </form>
  </section>
</template>

<script setup lang="ts">
import apiRequest from "@/utils/apiRequest";
import { UpdateChatroomDto } from "@/components/chat/penalty/chatUtils";
import { useRoute } from "vue-router";

const updateChatroomDto = new UpdateChatroomDto();
const route = useRoute();
const chatroomId = route.params.id;

function editChat(adminId: number) {
  const url = "/chat/" + chatroomId + "/admin/" + adminId + "/update/info";
  apiRequest(url, "put", { data: updateChatroomDto })
    .then((response) => {
      console.log(response);
    }) // axios throws errors for non 2xx responses by default!
    .catch((error) => {
      console.log(error);
    });

  // axios
  //   .post("http://localhost:3000/chat/create", postChatData)
  //   .then((response) => {
  //     console.log(response);
  //   }) // axios throws errors for non 2xx responses by default!
  //   .catch((error) => {
  //     console.log(error);
  //   });
}
</script>
