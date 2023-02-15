<template>
  <nav>
    <ul>
      <li>
        <router-link to="/account"
          ><font-awesome class="font-awesome" icon="user"
        /></router-link>
      </li>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/game">Game</router-link></li>
      <li><router-link to="/leaderboard">Leaderboard</router-link></li>
      <li><router-link to="/chat">Chat</router-link></li>
      <li><router-link to="/stream">Live</router-link></li>
      <li><router-link to="/friends">Friends</router-link></li>
      <li id="logout">
        <button @click="userStore.logOut()">
          <font-awesome class="font-awesome" icon="sign-out" />
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useUserStore } from "../stores/UserStore";
const userStore = useUserStore();
</script>

<style scoped>
ul {
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 20px;
  padding: 0;
}

li {
  font-size: 2.5em;
  padding: 0;
  font-family: "ArcadeClassic", sans-serif;
  display: inline-block;
  text-decoration: none;
}

li:first-child {
  margin-right: 20px;
}

li:last-child {
  margin-left: auto;
  justify-self: flex-end;
}

a {
  text-decoration: none;
  color: white;
}

a.router-link-exact-active {
  color: var(--primary-color);
}
a:hover {
  color: var(----primary-color-transparant);
  transition: all 0.2s ease;
}
</style>
