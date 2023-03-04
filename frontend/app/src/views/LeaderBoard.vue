<!--
    this should be the main page layout
    so the basic nav bar and the content div
    then there should be different components that render
    on different circumstances
-->

<template>
  <main>
    <div id="display-content">
      <h1>HIGHSCORES</h1>

      <!-- <h1>HIGHSCORES</h1>
      <ul>
        <h2>Rank</h2>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
      </ul>
      <ul>
        <h2>Player</h2>
        <li>12000</li>
        <li>11001</li>
        <li>10023</li>
        <li>500</li>
        <li>...</li>
      </ul>
      <ul>
        <h2>Wins</h2>
        <li>Sanni</li>
        <li>Leonieke</li>
        <li>Ocean</li>
        <li>Mark</li>
        <li>...</li>
      </ul>
      <ul>
        <h2>Losses</h2>
        <li>Sanni</li>
        <li>Leonieke</li>
        <li>Ocean</li>
        <li>Mark</li>
        <li>...</li>
      </ul> -->
    </div>
  </main>
</template>

<script setup lang="ts">
// query all game data from the users
// need to have there rate (score) based on that we will order them (rank)
// we will also need there playername
// the amount of wins they have
// amount of losses they have
</script>
<style scoped>
h1 {
  font-size: 4.5em;
}

/* div header {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
}

div h2 {
  font-size: 2.5em;
  width: 100%;
  /* border: 2px solid pink; */
/* padding: 0;
  margin: 0;
  margin-bottom: 10px; */
/* } */
/* 
ul {
  width: 100%;
  padding: 0;
  font-family: "ArcadeClassic", sans-serif;
  margin: 10px;
} */

/* ul li { */
/* font-size: 2.5em; */
/* border: 2px solid pink; */
/* list-style-type: none; */
/* text-decoration: none; */
/* } */
</style>
