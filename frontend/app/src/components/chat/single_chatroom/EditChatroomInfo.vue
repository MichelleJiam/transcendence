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
                  <option value="public">public</option>
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
                <label for="password" class="modal-text"
                  >Update password:<br />
                  <span class="small-text"
                    >(Warning! Will turn chat into a password chat)</span
                  ></label
                ><br />
                <input
                  id="password"
                  v-model="updateChatroomDto.password"
                  type="text"
                  class="modal-text padding"
                />
              </div>
              <div v-if="errorMessageAvailable() === true" class="padding">
                <span
                  >{{ errorMessage }}
                  <button class="error-x" @click="removeErrorText()">
                    X
                  </button></span
                >
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
import { ref } from "vue";

const props = defineProps({
  show: Boolean,
});

const updateChatroomDto = new UpdateChatroomDto();
const route = useRoute();
const chatroomId = route.params.id;
const userStore = useUserStore();
const errorMessage = ref<string>("");

function errorMessageAvailable() {
  if (errorMessage.value.length > 0) {
    return true;
  }
  return false;
}

function removeErrorText() {
  errorMessage.value = "";
}

function editChat(adminId: number) {
  const url = "/chat/" + chatroomId + "/admin/" + adminId + "/update/info";
  if (
    updateChatroomDto.type == undefined &&
    (updateChatroomDto.chatroomName == undefined ||
      !(
        updateChatroomDto.chatroomName && updateChatroomDto.chatroomName.trim()
      )) &&
    (updateChatroomDto.password == undefined ||
      !(updateChatroomDto.password && updateChatroomDto.password.trim()))
  ) {
    return;
  }
  if (
    updateChatroomDto.type == "password" &&
    !(updateChatroomDto.password && updateChatroomDto.password.trim())
  ) {
    errorMessage.value = "password type chat needs a password!";
    return;
  }
  if (
    updateChatroomDto.chatroomName != undefined &&
    !(updateChatroomDto.chatroomName && updateChatroomDto.chatroomName.trim())
  ) {
    updateChatroomDto.chatroomName = undefined;
  }
  if (updateChatroomDto.password && updateChatroomDto.password.trim()) {
    updateChatroomDto.type = "password";
  }
  console.log(updateChatroomDto);
  apiRequest(url, "put", { data: updateChatroomDto })
    .then((response) => {
      location.reload();
    }) // axios throws errors for non 2xx responses by default!
    .catch((error) => {
      // console.error(error);
      errorMessage.value = "Could not update chatroom info.";
    });
}
</script>

<style>
.small-text {
  font-size: 0.8rem;
}
.modal-text {
  font-size: 1.5rem;
}

.padding {
  margin: 0.5rem;
}

.error-x {
  width: 0.9rem;
  height: 0.9rem;
  font-size: 0.9rem;
  top: 0;
  left: 0;
  padding: 0;
}

.modal-mask {
  display: flex;
  flex-direction: column;
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
