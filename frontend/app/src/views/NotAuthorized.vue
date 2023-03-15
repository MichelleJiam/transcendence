<template>
    <main>
      <div id="display-content">
        <h1>401: Unauthorized</h1>
        <img src="../assets/images/401-unauthorized.jpeg" alt="404 not found" />
      </div>
    </main>
  </template>
  
  <script setup lang="ts"></script>
  
  <style scoped>
  #display-content {
    display: grid;
    align-content: center;
    justify-content: center;
    height: auto;
    width: auto;
  }

  img {
    width: 600px;
    height: auto;
  }
  
  h1 {
    font-size: 4em;
    color: var(--primary-color)
  }
  </style>
  