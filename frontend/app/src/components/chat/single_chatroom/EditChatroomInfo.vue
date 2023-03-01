<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
          <button class="modal-default-button" @click="$emit('close')">
            X
          </button>
          <slot name="header"><h3>Settings</h3> </slot>
        </div>

        <div class="modal-body">
          <slot name="body">
            <form @submit.prevent="editChat(userStore.user.id)">
              <div>
                <label>select type of chat:</label>
              </div>
              <div>
                <label for="type" class="modal-text padding"
                  >Choose a chat type:</label
                ><br />
                <select id="type" v-model="updateChatroomDto.type" name="type">
                  <option value="public" selected>public</option>
                  <option value="private">private</option>
                  <option value="password">password</option>
                </select>
              </div>
              <div>
                <label for="chatroomName" class="modal-text"
                  >Name the chat:</label
                ><br />
                <input
                  id="chatroomName"
                  v-model="updateChatroomDto.chatroomName"
                  type="text"
                  class="modal-text padding"
                />
              </div>
              <div>
                <label for="password" class="modal-text">Update password:</label
                ><br />
                <input
                  id="password"
                  v-model="updateChatroomDto.password"
                  type="text"
                  class="modal-text padding"
                />
              </div>
              <button>Update chat</button>
            </form>
          </slot>
        </div>

        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import apiRequest from "@/utils/apiRequest";
import { useRoute } from "vue-router";
import { UpdateChatroomDto } from "../chatUtils";

const props = defineProps({
  show: Boolean,
});

const updateChatroomDto = new UpdateChatroomDto();
const route = useRoute();
const chatroomId = route.params.id;
const userStore = useUserStore();

function editChat(adminId: number) {
  const url = "/chat/" + chatroomId + "/admin/" + adminId + "/update/info";
  apiRequest(url, "put", { data: updateChatroomDto })
    .then((response) => {
      console.log(response);
      location.reload();
    }) // axios throws errors for non 2xx responses by default!
    .catch((error) => {
      alert(error);
    });
}
</script>

<style>
.modal-text {
  font-size: 1.5rem;
}

.padding {
  margin: 0.5rem;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 40rem;
  margin: auto;
  padding: 20px 30px;
  /* background-color: #fff; */
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
