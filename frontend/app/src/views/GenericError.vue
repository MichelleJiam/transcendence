<template>
  <main>
    <div id="display-content">
      <h1>Oops..</h1>
      <h1>something went wrong</h1>
      <img src="../assets/images/generic-error.webp" alt="404 not found" />
    </div>
  </main>
</template>

<script setup lang="ts"></script>

<style scoped>
#display-content {
  display: grid;
  align-items: center;
  justify-content: center;
  height: auto;
  width: auto;
}

img {
  width: 600px;
  height: auto;
  margin-left: auto;
  margin-right: auto;
}

h1 {
  font-size: 4em;
  color: var(--primary-color);
}
</style>
