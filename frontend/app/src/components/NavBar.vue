<template>
  <nav>
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/game">Game</router-link></li>
      <!-- do we want the user link to go to the user ID? -->
      <li><router-link to="/account">Account</router-link></li>
      <li><router-link to="/leaderboard">Leaderboard</router-link></li>
      <li><router-link to="/chat">Chat</router-link></li>
      <li><router-link to="/stream">Live</router-link></li>
      <!-- when this is click login should be set to false -->
      <li id="logout">
        <router-link to="/login" @click="setNavigationGuard"
          >Logout</router-link
        >
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useNavigationStore } from "../stores/navigation";
const navigationGuard = useNavigationStore();
function setNavigationGuard(): void {
  navigationGuard.loggedIn = false;
}
</script>

<style>
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

nav ul {
  margin: 5px;
  padding: 0px;
}

nav li {
  font-size: 2.5em;
  font-family: "ArcadeClassic", sans-serif;
  display: inline-block;
  text-decoration: none;
  padding: 0px 10px 0px 15px;
  text-align: center;
}

nav li a {
  text-decoration: none;
  color: white;
  padding: 0;
}

li#logout {
  /* position the log out link to the right of the page */
  position: absolute;
  right: 0;
}

a.router-link-exact-active {
  color: #39ff14;
}
a:hover {
  color: #88ff72;
  transition: all 0.2s ease;
}
</style>
