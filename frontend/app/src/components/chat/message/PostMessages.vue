<template>
  <section>
    <form @submit.prevent="createPost">
      <div>
        <label for="userId">userId:</label>
        <input id="userId" v-model="postData.userId" type="number" required />
      </div>
      <div>
        <label for="body">Message: </label>
        <input id="body" v-model="postData.body" type="text" required />
      </div>
      <button>Post Message</button>
    </form>
  </section>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      postData: {
        body: "",
        userId: "", // right now you have to manually input a user because i don't have a login system, just use a userId that's in the system (it will break if you use one outside of it :') )
      },
    };
  },
  methods: {
    createPost() {
      axios
        .post("http://localhost:3000/message/create", this.postData)
        .then((response) => {
          console.log(response);
          this.$router.go(0); // upon success, the page will refresh and show the updated messages
        }) // axios throws errors for non 2xx responses by default!
        .catch
        // handle errors here
        ();
    },
  },
});
</script>
