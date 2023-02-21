<template>
  <nav id="overlay">
    <ul class="navbar">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link :to="{name:'account', params: {id: useUserStore.$id}}">Account</router-link></li>
      <li><router-link to="/game">Game</router-link></li>
      <li><router-link to="/leaderboard">Leaderboard</router-link></li>
      <li><router-link to="/chat">Chat</router-link></li>
      <li><router-link to="/stream">Live</router-link></li>
      <li><router-link to="/friends">Friends</router-link></li>
    </ul>
    <div class="main">
      <button class="logout-icon" @click="userStore.logOut()">
        <font-awesome class="font-awesome logout-icon" icon="sign-out" />
      </button>
      <button class="menu-icon">
        <font-awesome class="font-awesome" icon="bars" />
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useUserStore } from "../stores/UserStore";
const userStore = useUserStore();

</script>

<style scoped>
nav {
  border: 2px solid blue;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  transition: all .5s ease;
}
.navbar {
  /* border: 2px solid white; */
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
  transition: all .2s ease;
}

.logout-icon {

}
.navbar a.router-link-exact-active {
  color: var(--primary-color);
}
.navbar a:hover {
  color: var(--primary-color-transparant);
  transition: all 0.5s ease;
}

.main {
  display: flex;
  align-items: center;
}

.main button {
  /* margin-right: 25px; */
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
    /* display: none; */
    font-size: 2em;
  }
}

@media (max-width: 875px) {
  .menu-icon {
    display: block;
  }
  .navbar {
    position: absolute;
    top: 100%;
    left: 2%;
    width: 500px;
    height: 30vh;
    flex-direction: column;
  }
/* BUTOON IS DISSAPEARING ATM, FIX THIS */
  .logout-icon {
    position: absolute;
    right: 2%;
    /* top: 1; */
    display: inline-block;
    width: auto;
    height: auto;
    padding: 0;
  }
}


/* ul {
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 20px;
  padding: 0;
} */

/* li {
  font-size: 2.5em;
  padding: 0;
  font-family: "ArcadeClassic", sans-serif;
  display: inline-block;
  text-decoration: none;
  list-style: none;
} */

/* .logout {

} */
/* .font-awesome {
  font-size: 1em;
} */

/* li:last-child {
  margin-left: auto;
  justify-self: flex-end;
} */

/* a {
  text-decoration: none;
  color: white;
}

a.router-link-exact-active {
  color: var(--primary-color);
}
a:hover {
  color: var(--primary-color-transparant);
  transition: all 0.2s ease;
} */
</style>
