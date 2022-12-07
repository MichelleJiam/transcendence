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
      <li v-for="route in routes" :key="route.id" class="nav-item">
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
        { path: "/", name: "Home", id: 1 },
        { path: "/about", name: "About", id: 2 },
        { path: "/pong", name: "Pong", id: 3 },
        { path: "/chat", name: "Chat", id: 4 },
        { path: "/settings", name: "Settings", id: 5 },
      ],
    };
  },
};
</script>
