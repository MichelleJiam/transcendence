<script setup lang="ts">
import axios from "axios";

const adminId = 1; // replace this with the user Id in the cookie

const penalty = {
  penaltyType: String,
  user: Number,
  chatroom: Number,
};

function createPenalty() {
  if (!penalty.penaltyType) {
    throw new TypeError("faulty ban type");
  }
  const url =
    "http://localhost:3000/chatroom/" + penalty.chatroom + "/admin/" + adminId;

  axios.post(url, penalty).catch((error) => {
    console.log(error);
  });
}
</script>
