<template>
  <section>
    <button id="settings-button" @click="showModal = true">Settings</button>
    <modal v-if="showModal" @close="showModal = false">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-header">
              <button class="modal-default-button" @click="$emit('close')">
                OK
              </button>
            </div>
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
      </div>
    </modal>
  </section>
</template>

<script setup lang="ts">
import apiRequest from "@/utils/apiRequest";
import { UpdateChatroomDto } from "@/components/chat/chatUtils";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
import { ref } from "vue";

const showModal = ref(false);
const emit = defineEmits(["close"]);

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
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
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

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
