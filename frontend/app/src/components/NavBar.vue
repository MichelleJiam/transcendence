<template>
  <nav class="navbar navbar-expand-sm bg-light navbar-light">
    <a class="navbar-brand" href="/">
      <img
        src="../assets/pong.png"
        width="40"
        height="40"
        class="d-inline-block align-top"
        alt="pong-logo"
      />
    </a>
    <ul class="navbar-nav">
      <li v-for="route in routes" :key="route.name" class="nav-item">
        <router-link class="nav-link" :to="route.path">{{
          route.name
        }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
export default {
  name: "NavBar",
  data() {
    return {
      routes: [
        { path: "/", name: "Home" },
        { path: "/about", name: "About" },
        { path: "/pong", name: "Pong" },
        { path: "/chat", name: "Chat" },
        { path: "/user-settings", name: "UserSettings" },
      ],
    };
  },
};
</script>
