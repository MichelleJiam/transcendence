<template>
  <section>
    <div v-if="inviteReceived == false">
      <button @click="inviteToGame()">Invite to Game</button>
    </div>
    <div v-else-if="inviteReceived == true && firstPlayer == userStore.user.id">
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
import { useUserStore } from "@/stores/UserStore";
import apiRequest, { baseUrl } from "@/utils/apiRequest";
import { io } from "socket.io-client";
import { ref, onMounted } from "vue";

class InviteToGameDto {
  playerOne!: number;
  playerTwo!: number;
  status = "waiting";
}

const userStore = useUserStore();
const socketUrl = baseUrl + "/penalty"; // change this to the game gateway later
const socket = io(socketUrl);
const firstPlayer = ref<number>();
const firstPlayerData = ref();
const secondPlayer = ref<number>();
const inviteReceived = ref<boolean>(false);

const props = defineProps({
  playerTwo: Number,
});

async function inviteToGame() {
  const inviteToGameDto = new InviteToGameDto();
  inviteToGameDto.playerOne = userStore.user.id;
  inviteToGameDto.status = "waiting";
  if (props.playerTwo != undefined) {
    inviteToGameDto.playerTwo = props.playerTwo;
    console.log("invite to game has been emitted");
    socket.emit("inviteToGame", inviteToGameDto);
    inviteReceived.value = false;
  }
}

async function respondToInvite(response: string) {
  if (response != "accept" && response != "reject") {
    console.log("bad input in invite response");
    return;
  } else {
    const inviteToGameDto = new InviteToGameDto();
    if (firstPlayer.value != undefined && secondPlayer.value != undefined) {
      inviteToGameDto.playerOne = firstPlayer.value;
      inviteToGameDto.playerTwo = secondPlayer.value;
      inviteToGameDto.status = response;
      socket.emit("inviteToGame", inviteToGameDto);
    } else {
      console.log("RespondToInvite failed.");
    }
  }
}

async function cancelInvite() {
  const inviteToGameDto = new InviteToGameDto();
  if (firstPlayer.value != undefined && secondPlayer.value != undefined) {
    inviteToGameDto.playerOne = firstPlayer.value;
    inviteToGameDto.playerTwo = secondPlayer.value;
    inviteToGameDto.status = "cancel";
    socket.emit("inviteToGame", inviteToGameDto);
  } else {
    console.log("cancelInvite failed.");
  }
}

// class CreateGameDto {
//   playerOne!: number;
//   playerTwo!: number;
//   state = "DM";
// }

onMounted(async () => {
  socket.on("sendGameRequestToPlayerTwo", async (payload) => {
    if (payload.playerOne == userStore.user.id) {
      inviteReceived.value = true;
      firstPlayer.value = userStore.user.id;
      secondPlayer.value = payload.playerTwo;
    }
    if (payload.playerTwo == userStore.user.id) {
      firstPlayer.value = payload.playerOne;
      await apiRequest("/user/" + payload.playerOne, "get")
        .then((response) => {
          firstPlayerData.value = response.data;
        })
        .catch((err) => console.error(err));
      secondPlayer.value = payload.playerTwo;
      inviteReceived.value = true;
      console.log("You are being invited to a game");
    }
  });

  socket.on("acceptedGameInvite", async (payload) => {
    if (
      payload.playerTwo == userStore.user.id ||
      payload.playerOne == userStore.user.id
    ) {
      // do whatever you need to accept the game here;
      console.log("PlayerTwo accepted your game request");
      const createGameDto = new CreateGameDto();
      createGameDto.playerOne = payload.playerOne;
      createGameDto.playerTwo = payload.playerTwo;
      await apiRequest(baseUrl + "/game", "post", { data: createGameDto });
      window.location.href = "/game";
      inviteReceived.value = false;
    }
  });

  socket.on("declinedGameInvite", (payload) => {
    if (
      payload.playerTwo == userStore.user.id ||
      payload.playerOne == userStore.user.id
    ) {
      // do whatever you need to reject the game here
      console.log("PlayerTwo declined your game request");
      inviteReceived.value = false;
    }
  });

  socket.on("canceledInvite", (payload) => {
    if (
      payload.playerTwo == userStore.user.id ||
      payload.playerOne == userStore.user.id
    ) {
      // do whatever you need to reject the game here
      console.log("PlayerOne canceled their game request.");
      inviteReceived.value = false;
    }
  });

  socket.on("inviteGameError", (payload) => {
    if (
      payload.playerTwo == userStore.user.id ||
      payload.playerOne == userStore.user.id
    ) {
      console.log("There was a problem with your game invite");
      inviteReceived.value = false;
    }
  });
});

// make buildgameDto (or ask swaan about the frontend DTO for it?)
// build the DTO
// use the axios call to hit the backend and create and redirect to the game.
</script>
<style scoped>
.padding {
  margin-right: 2rem;
}
</style>
