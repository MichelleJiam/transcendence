<template>
  <main>
    <div id="display-content">
      <h1>404 page not found</h1>
      <img src="../assets/images/404-notfound.jpeg" alt="404 not found" />
    </div>
  </main>
</template>

<script setup lang="ts"></script>

<style scoped>
#display-content {
  display: grid;
  grid-template-columns: 1fr;
  align-content: center;
  justify-content: center;
  height: auto;
  width: auto;
}

img {
  width: 400;
}

h1 {
  font-size: 4em;
  color: var(--primary-color)
}
</style>
