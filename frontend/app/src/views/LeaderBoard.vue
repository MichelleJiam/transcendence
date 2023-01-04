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
      <header>
        <!-- <h2 id="rank">RANK</h2> -->
        <ul>
          <h2>RANK</h2>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
        </ul>
        <ul>
          <h2>SCORE</h2>
          <li>12000</li>
          <li>11001</li>
          <li>10023</li>
          <li>500</li>
          <li>...</li>
        </ul>
        <ul>
          <h2>NAME</h2>
          <li>Sanni</li>
          <li>Leonieke</li>
          <li>Ocean</li>
          <li>Mark</li>
          <li>...</li>
        </ul>
      </header>
    </div>
  </main>
</template>

<script setup lang="ts">
// import HighScores from "../types/UserInfo";
// const highscores: HighScores[] = {
// };
</script>
<style scoped>
main {
  color: white;
}

/* div #display-content {
  height: 80%;
  width: 70%;
  background: #1c1b1b;
  text-align: center;
  border: 2px #302d2d solid;
  border-radius: 5px;
} */

div h1 {
  font-size: 3em;
  padding: 0;
  margin: 0;
  margin-top: 15px;
  margin-bottom: 15px;
  /* border: 2px solid pink; */
}

div header {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
}

div h2 {
  font-size: 2.5em;
  width: 100%;
  /* border: 2px solid pink; */
  padding: 0;
  margin: 0;
  margin-bottom: 10px;
}

ul {
  width: 100%;
  padding: 0;
  font-family: "ArcadeClassic", sans-serif;
  margin: 10px;
}

ul li {
  font-size: 2.5em;
  /* border: 2px solid pink; */
  list-style-type: none;
  /* text-decoration: none; */
}
</style>
