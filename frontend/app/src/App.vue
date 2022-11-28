<template>
  <header>
    <NavBar />
  </header>
  <RouterView />
</template>

<script lang="ts">
import { RouterView } from "vue-router";
import NavBar from './components/NavBar.vue'

export default {
  name: 'App',
  components: { NavBar }
}
</script>
