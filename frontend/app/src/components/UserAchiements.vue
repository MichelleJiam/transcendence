<template>
  <div>
    <h2>Achievements</h2>
    <p class="img__description">This image looks super neat.</p>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
h2 {
  font-size: 50px;
}

.img__description::before {
  display: none;
  content: "Hover over image";
}

h2:hover + .img__description::before {
  display: block;
  position: absolute;
  background-color: #333;
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  left: 50%;
  top: -30px;
  transform: translate(-50%, 0);
}
</style>