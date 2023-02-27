<template>
  <nav>
    <ul class="navbar" :class="{notactive: !menuOpen}">
      <li @click="closeMenu"><router-link to="/">Home</router-link></li>
      <li @click="closeMenu"><router-link :to="{name:'account', params: {id: useUserStore.$id}}">Account</router-link></li>
      <li @click="closeMenu"><router-link to="/game">Game</router-link></li>
      <li @click="closeMenu"><router-link to="/leaderboard">Leaderboard</router-link></li>
      <li @click="closeMenu"><router-link to="/chat">Chat</router-link></li>
      <li @click="closeMenu"><router-link to="/stream">Live</router-link></li>
      <li @click="closeMenu"><router-link to="/friends">Friends</router-link></li>
      <li @click="closeMenu"><router-link to="/login" @click="userStore.logOut()" class="logout-text">Logout</router-link></li>
    </ul>
    <div class="buttons">
      <button class="menu-icon" @click="openMenu"> 
        <font-awesome class="font-awesome" icon="bars"/>
      </button>
      <button class="logout-icon" @click="userStore.logOut()">
        <font-awesome class="font-awesome logout-icon" icon="sign-out"/>
      </button>
    </div>
    <div :class="{overlay: menuOpen}"></div>
  </nav>
</template>

<script setup lang="ts">
import { useUserStore } from "../stores/UserStore";
import { ref, onMounted, computed, watchEffect } from "vue";
const userStore = useUserStore();
let menuOpen = ref(false);
let windowWidth = ref(window.innerWidth);

onMounted(() => {
    window.onresize = () => {
      windowWidth.value = window.innerWidth;
      console.log(windowWidth.value);
  }
})

watchEffect(() => {
  if (windowWidth.value >= 1100 && menuOpen.value == true) {
    menuOpen.value = false;
  }
})

function openMenu() {
  menuOpen.value = !menuOpen.value;
  console.log(menuOpen.value)
}

function closeMenu() {
  if (menuOpen.value == true) {
    menuOpen.value = false;
  }
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
  align-items: center;
  justify-content: space-between;
}
.navbar {
  width: 1000px;
  display: flex;
  justify-content: space-around;
}

.buttons {
  position: fixed;
  top: 0;
  right: 0;
  padding: 5px;
  z-index: 999;
}

li {
  list-style: none;
}
.navbar a {
  color: white;
  font-family: "ArcadeClassic", sans-serif;
  text-decoration: none;
  list-style: none;
  font-size: 2.5rem;
  padding: 5px 0;
  margin-right: 10px;
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
.menu-icon {
  cursor: pointer;
  z-index: 9999;
  display: none;
}

@media (max-width: 1100px) {
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
