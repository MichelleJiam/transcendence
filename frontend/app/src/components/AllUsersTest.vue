<template>
  <div class="container">
    <h1 class="pt-3 pb-3">Users currently in database</h1>
    <div class="container">
      <div class="row">
        <div class="col-sm"><b>Name</b></div>
        <div class="col-sm"><b>Email</b></div>
        <br />
        <br />
      </div>
      <div v-if="users.length > 0">
        <div v-for="user in users" :key="user.id" class="row">
          <div class="col-sm">{{ user.username }}</div>
          <div class="col-sm">{{ user.email }}</div>
          <hr />
        </div>
      </div>
      <div v-else><i>No users in database</i></div>
    </div>
  </div>
</template>

<!-- API call -->

<script lang="ts">
type User = {
  id: string;
  username: string;
  email: string;
};
export default {
  data() {
    return {
      users: new Array<User>(),
    };
  },
  mounted() {
    fetch("http://localhost:3000/user/")
      .then((res) => res.json())
      .then((data) => (this.users = data))
      .catch((err) => console.log(err.message));
  },
};
</script>
