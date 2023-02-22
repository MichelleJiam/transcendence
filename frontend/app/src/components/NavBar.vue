<template>
  <nav>
    <ul class="navbar" :class="{notactive: !menuOpen}">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link :to="{name:'account', params: {id: useUserStore.$id}}">Account</router-link></li>
      <li><router-link to="/game">Game</router-link></li>
      <li><router-link to="/leaderboard">Leaderboard</router-link></li>
      <li><router-link to="/chat">Chat</router-link></li>
      <li><router-link to="/stream">Live</router-link></li>
      <li><router-link to="/friends">Friends</router-link></li>
      <li><router-link to="/login" @click="userStore.logOut()" class="logout-text">Logout</router-link></li>
    </ul>
    <div class="buttons">
      <button class="logout-icon" @click="userStore.logOut()">
        <font-awesome class="font-awesome logout-icon" icon="sign-out"/>
      </button>
      <button class="menu-icon" @click="test"> 
        <font-awesome class="font-awesome" icon="bars"/>
      </button>
    </div>
    <!-- the div to overlay when the menu button is clicked and the size is small -->
    <div :class="{overlay: menuOpen}"></div>
  </nav>
</template>

<script setup lang="ts">
import { useUserStore } from "../stores/UserStore";
import { ref } from "vue";
const userStore = useUserStore();
let menuOpen = ref(false);

function test() {
  menuOpen.value = !menuOpen.value;
  console.log(menuOpen.value)
}

</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 2;
  width: 100%;
  height: 100%;
}
nav {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  /* transition: all .5s ease; */
}
.navbar {
  width: 1000px;
  display: flex;
  justify-content: space-around;
}

li {
  list-style: none;
}
.navbar a {
  color: white;
  font-family: "ArcadeClassic", sans-serif;
  text-decoration: none;
  list-style: none;
  font-size: 2.5em;
  padding: 5px 0;
  margin-right: 10px;
  /* transition: all .2s ease; */
}

.navbar .logout-text {
  display: none;
}

.navbar a.router-link-exact-active {
  color: var(--primary-color);
}
.navbar a:hover {
  color: var(--primary-color-transparant);
  transition: all 0.5s ease;
}

.buttons {
  display: flex;
  align-items: center;
}

.buttons button {
  margin-left: 10px;
}

.menu-icon {
  cursor: pointer;
  z-index: 9999;
  display: none;
}

@media (max-width: 1100px) {
  .navbar {
    width: 800px;
  }
  .navbar a {
    font-size: 2em;
  }
}

@media (max-width: 875px) {
  .menu-icon {
    display: block;
  }
  .navbar {
    position: absolute;
    top: 0;
    padding-top: 50%;
    width: 100%;
    flex-direction: column;
    align-items: center;
    z-index: 99;
    font-size: 1.5rem;
    row-gap: 1rem;
  }

  .notactive {
    display: none;
  }
  .logout-icon {
    display: none;
  }
  .logout-text {
    display: none;
  }
  .navbar .logout-text {
    display: block;
  }
}
</style>
