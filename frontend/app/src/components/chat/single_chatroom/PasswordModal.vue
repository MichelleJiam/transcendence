<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
          <button
            v-if="rightPassword == true"
            class="modal-default-button"
            @click="$emit('close')"
          >
            ENTER THE CHAT
          </button>
          <slot name="header"><h3>Password</h3> </slot>
        </div>

        <div class="modal-body">
          <slot name="body">
            <form @submit.prevent="enterChat(userStore.user.id)">
              <div>
                <label for="password">Enter password:</label>
                <input id="password" v-model="givenPassword" type="text" />
              </div>
              <button>→</button>
            </form>
          </slot>
        </div>

        <div class="modal-footer">
          <slot name="footer"> </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import apiRequest, { baseUrl } from "@/utils/apiRequest";
import { useRoute } from "vue-router";
import { AddMemberDto } from "../chatUtils";
import { ref } from "vue";
import { io } from "socket.io-client";

const props = defineProps({
  show: Boolean,
});

const addMemberDto = new AddMemberDto();
const route = useRoute();
const chatroomId = route.params.id;
const userStore = useUserStore();
const givenPassword = ref<string>();
const rightPassword = ref<boolean>(false);

const socketUrl = baseUrl + "/penalty";
const socket = io(socketUrl);

function enterChat(memberId: number) {
  const url = "/chat/" + chatroomId + "/add/member";
  addMemberDto.member = memberId;
  addMemberDto.password = givenPassword.value;
  if (!(givenPassword.value && givenPassword.value.trim())) {
    return;
  }
  apiRequest(url, "put", { data: addMemberDto })
    .then((response) => {
      rightPassword.value = true;
      socket.emit("newUserState");
    }) // axios throws errors for non 2xx responses by default!
    .catch((err) => {
      alert("Bad password!");
      givenPassword.value = "";
    });
}
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 1);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 40rem;
  margin: auto;
  padding: 20px 30px;
  /* background-color: #fff; */
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0);
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
