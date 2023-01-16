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
      <!-- do we want the user link to go to the user ID? -->
      <!-- <li><router-link to="/account">Account</router-link></li> -->
      <li><router-link to="/leaderboard">Leaderboard</router-link></li>
      <li><router-link to="/chat">Chat</router-link></li>
      <li><router-link to="/stream">Live</router-link></li>
      <!-- when this is click login should be set to false -->
      <li id="logout">
        <router-link to="/login" @click="setNavigationGuard">
          <font-awesome class="font-awesome" icon="sign-out" />
        </router-link>
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

<style scoped>
ul {
  /* display: flex; */
  justify-content: left;
  align-items: center;
  gap: 20px;
}

li {
  font-size: 2.5em;
  font-family: "ArcadeClassic", sans-serif;
  display: inline-block;
  text-decoration: none;
}

li:last-child {
  margin-left: auto;
  margin-right: 20px;
  justify-self: flex-end;
  background-color: pink;
}

a {
  text-decoration: none;
  color: white;
}

a.router-link-exact-active {
  color: #39ff14;
}
a:hover {
  color: #88ff72;
  transition: all 0.2s ease;
}
</style>
