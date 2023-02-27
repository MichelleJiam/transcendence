<template>
	<div class="stats-container">
		<h2>Game History</h2>
		<!-- a div with all game history in formation -->
		<div class="winner-loser">
			<h3 class="winner-title">WINNER</h3>
			<h3 class="loser-title">LOSER</h3>
		</div>
		<div class="gamehistory-list">
			<li v-for="item in gameHistory">
				<div class="winner">{{ item.winner }}</div>
				<div class="loser">{{ item.loser }}</div>
			</li>
		</div>
	</div>
</template>

<script setup lang="ts">

// change this for a call to the back end with all the games
// where is current player has played in this call should return
// an array with all the game objects 
// important that they should also be sorted based on the game id
const gameHistory = [
	{gameid: 1, winner: "sanne", loser: "test1"},
	{gameid: 2, winner: "sanne", loser: "test2"},
	{gameid: 3, winner: "test1", loser: "sanne"},
	{gameid: 4, winner: "sanne", loser: "test4"},
	{gameid: 5, winner: "test2", loser: "sanne"},
	{gameid: 6, winner: "sanne", loser: "test3"},
	{gameid: 7, winner: "sanne", loser: "test5"},
	{gameid: 8, winner: "sanne", loser: "test1"},
	{gameid: 9, winner: "sanne", loser: "test2"},
	{gameid: 10, winner: "test1", loser: "sanne"},
	{gameid: 11, winner: "sanne", loser: "test4"},
	{gameid: 12, winner: "test2", loser: "sanne"},
	{gameid: 13, winner: "sanne", loser: "test3"},
	{gameid: 14, winner: "sanne", loser: "test5"},
	{gameid: 15, winner: "sanne", loser: "test1"},
	{gameid: 16, winner: "sanne", loser: "test2"},
	{gameid: 17, winner: "test1", loser: "sanne"},
	{gameid: 18, winner: "sanne", loser: "test4"},
	{gameid: 19, winner: "test2", loser: "sanne"},
	{gameid: 20, winner: "sanne", loser: "test3"},
	{gameid: 21, winner: "sanne", loser: "test5"},
	{gameid: 22, winner: "sanne", loser: "test1"},
	{gameid: 23, winner: "sanne", loser: "test2"},
	{gameid: 24, winner: "test1", loser: "sanne"},
	{gameid: 25, winner: "sanne", loser: "test4"},
	{gameid: 26, winner: "test2", loser: "sanne"},
	{gameid: 27, winner: "sanne", loser: "test3"},
	{gameid: 28, winner: "sanne", loser: "test5"}]

</script>

<style scoped>
.stats-container {
	display: flex;
	flex-direction: column;
	height: 700px;
	width: 100%;
	padding: 20px;

	background-color: var(--box-background-color);
	box-shadow: var(--box-shadow);
	border: var(--border);
	border-radius: var(--border-radius);
}
.winner-loser {
	display: flex;
	justify-content: space-between;
	padding: 15px;
}

.winner-title {
	color: var(--primary-color);
}

.loser-title {
	color: var(--loser-color);
}
.gamehistory-list {
	font-size: 1.2rem;
	overflow: scroll;
	overflow-x: hidden;
}
.gamehistory-list li {
	display: flex;
	justify-content: space-between;
	padding: 10px;
	background-color: #2b2929b6;
	padding-left: 20px;
	padding-right: 20px;
	margin: 2px;
	border-radius: 4px;
}

span:first-child{
	padding-right: 10px;
}

h2 {
	font-size: 50px;
	/* color: var(--primary-color); */
}

/* TEMP SCROLLBAR STYLING */
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: var(--primary-color);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #2b2929b6;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #2b2929;
}
</style>