<template>
  <section>
    <div v-if="inviteReceived == false">
      <button @click="inviteToGame()">Invite to Game</button>
    </div>
    <div
      v-else-if="inviteReceived == true && firstPlayer == props.currentUserId"
    >
      <button @click="cancelInvite()">cancel invite</button>
    </div>
    <div v-else>
      You've been invited to a game by {{ firstPlayerData?.playerName }} <br />
      <button class="padding" @click="respondToInvite('accept')">accept</button>
      <button @click="respondToInvite('reject')">reject</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import apiRequest, { baseUrl } from "@/utils/apiRequest";
import { io } from "socket.io-client";
import { ref, onMounted, onUnmounted } from "vue";
import router from "@/router";

const props = defineProps({
  currentUserId: { type: Number, required: true },
  playerTwo: { type: Number, required: true },
  chatroomId: { type: Number, required: true },
  inviteToGameUserId: { type: Number, default: 0 },
});

const socketUrl = baseUrl + "/chat";
const socket = io(socketUrl);
const firstPlayer = ref<number>();
const firstPlayerData = ref();
const secondPlayer = ref<number>();
const inviteReceived = ref<boolean>(false);

class CreateGameDto {
  playerOne!: number;
  playerTwo!: number;
  state!: string;
  join!: boolean;
}

class InviteToGameDto {
  chatroomId!: number;
  playerOne!: number;
  playerTwo!: number;
  status = "waiting";
}

onMounted(async () => {
  if (props.inviteToGameUserId > 0) {
    inviteReceived.value = true;
    firstPlayer.value = props.inviteToGameUserId;
    if (firstPlayer.value != props.currentUserId)
      secondPlayer.value = props.currentUserId;
    else secondPlayer.value = props.playerTwo;
    await apiRequest("/user/" + props.inviteToGameUserId, "get")
      .then((response) => {
        firstPlayerData.value = response.data;
      })
      .catch((err) => console.error(err));
  }
  socket.on("sendGameRequestToPlayerTwo", async (payload) => {
    if (payload.chatroomId == props.chatroomId) {
      if (payload.playerOne == props.currentUserId) {
        inviteReceived.value = true;
        firstPlayer.value = props.currentUserId;
        secondPlayer.value = payload.playerTwo;
      }
      if (payload.playerTwo == props.currentUserId) {
        firstPlayer.value = payload.playerOne;
        await apiRequest("/user/" + payload.playerOne, "get")
          .then((response) => {
            firstPlayerData.value = response.data;
          })
          .catch((err) => console.error(err));
        secondPlayer.value = payload.playerTwo;
        inviteReceived.value = true;
      }
    }
  });

  socket.on("acceptedGameInvite", async (payload) => {
    if (payload.chatroomId == props.chatroomId) {
      if (
        payload.playerTwo == props.currentUserId ||
        payload.playerOne == props.currentUserId
      ) {
        if (payload.playerOne == props.currentUserId) {
          const createGameDto = new CreateGameDto();
          createGameDto.playerOne = payload.playerOne;
          createGameDto.playerTwo = payload.playerTwo;
          createGameDto.state = "dm";
          createGameDto.join = false;
          await apiRequest("/game", "post", { data: createGameDto }).catch(
            (err) => {
              console.error(err);
            }
          );
        }
        router.push("/game");
        inviteReceived.value = false;
      }
    }
  });

  socket.on("declinedGameInvite", (payload) => {
    if (payload.chatroomId == props.chatroomId) {
      if (
        payload.playerTwo == props.currentUserId ||
        payload.playerOne == props.currentUserId
      ) {
        inviteReceived.value = false;
      }
    }
  });

  socket.on("canceledInvite", (payload) => {
    if (payload.chatroomId == props.chatroomId) {
      if (
        payload.playerTwo == props.currentUserId ||
        payload.playerOne == props.currentUserId
      ) {
        inviteReceived.value = false;
      }
    }
  });

  socket.on("inviteGameError", (payload) => {
    if (payload.chatroomId == props.chatroomId) {
      if (
        payload.playerTwo == props.currentUserId ||
        payload.playerOne == props.currentUserId
      ) {
        inviteReceived.value = false;
      }
    }
  });
});

onUnmounted(() => {
  const inviteToGameDto = new InviteToGameDto();
  if (firstPlayer.value != undefined && secondPlayer.value != undefined) {
    inviteToGameDto.chatroomId = props.chatroomId;
    inviteToGameDto.playerOne = firstPlayer.value;
    inviteToGameDto.playerTwo = secondPlayer.value;
    inviteToGameDto.status = "cancel";
    socket.emit("inviteToGame", inviteToGameDto);
  }
});

async function inviteToGame() {
  const inviteToGameDto = new InviteToGameDto();
  inviteToGameDto.chatroomId = props.chatroomId;
  inviteToGameDto.playerOne = props.currentUserId;
  inviteToGameDto.playerTwo = props.playerTwo;
  inviteToGameDto.status = "waiting";
  socket.emit("inviteToGame", inviteToGameDto);
  inviteReceived.value = false;
}

async function respondToInvite(response: string) {
  if (response != "accept" && response != "reject") {
    return;
  } else {
    const inviteToGameDto = new InviteToGameDto();
    if (firstPlayer.value != undefined && secondPlayer.value != undefined) {
      inviteToGameDto.chatroomId = props.chatroomId;
      inviteToGameDto.playerOne = firstPlayer.value;
      inviteToGameDto.playerTwo = secondPlayer.value;
      inviteToGameDto.status = response;
      socket.emit("inviteToGame", inviteToGameDto);
    }
  }
}

async function cancelInvite() {
  const inviteToGameDto = new InviteToGameDto();
  if (firstPlayer.value != undefined && secondPlayer.value != undefined) {
    inviteToGameDto.chatroomId = props.chatroomId;
    inviteToGameDto.playerOne = firstPlayer.value;
    inviteToGameDto.playerTwo = secondPlayer.value;
    inviteToGameDto.status = "cancel";
    socket.emit("inviteToGame", inviteToGameDto);
  }
}
</script>
<style scoped>
.padding {
  margin-right: 2rem;
}
</style>
