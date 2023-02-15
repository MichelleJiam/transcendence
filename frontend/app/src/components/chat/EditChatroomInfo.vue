<template>
  <section>
    <button id="settings-button" @click="useToggleModal()">Settings</button>
    <div id="chat-settings" class="modal">
      <div class="modal-content">
        <span class="close">&times;</span>
        <form @submit.prevent="editChat(userStore.user.id)">
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
            <input
              id="password"
              v-model="updateChatroomDto.password"
              type="text"
            />
          </div>
          <button>Update chat</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import apiRequest from "@/utils/apiRequest";
import { UpdateChatroomDto } from "@/components/chat/chatUtils";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
import { reactive, readonly } from "vue";

const updateChatroomDto = new UpdateChatroomDto();
const route = useRoute();
const chatroomId = route.params.id;
const userStore = useUserStore();

function editChat(adminId: number) {
  const url = "/chat/" + chatroomId + "/admin/" + adminId + "/update/info";
  apiRequest(url, "put", { data: updateChatroomDto })
    .then((response) => {
      console.log(response);
    }) // axios throws errors for non 2xx responses by default!
    .catch((error) => {
      console.log(error);
    });
}

const modal = reactive({
  role: [],
});

function useToggleModal() {
  const toggleModel = (role = "") => {
    modal.role.pop();
  };

  const openModal = (role = "") => {
    modal.role.push({ type: role, isOpen: true });
  };

  const hasRole = (role = "") => {
    if (role === "") return false;
    const findRole = modal.role.find((currentRole) =>
      currentRole.type === "" ? null : currentRole.type === role
    );
    if (findRole === undefined) return false;

    return findRole.type === role && findRole.isOpen === true ? true : false;
  };

  return {
    state: readonly(modal),
    toggleModel,
    openModal,
    hasRole,
  };
}
</script>

<style scoped>
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

/* The Close Button */
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>
