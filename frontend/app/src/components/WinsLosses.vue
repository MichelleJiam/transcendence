<template>
<div class="stats-container box-styling">
		<h2 id="wins">WINS</h2>
		<h2 id="losses">LOSSES</h2>
		<h3 id="wins-count">{{ wins }}</h3>
		<h3 id="losses-count">{{ losses }}</h3>
</div>
</template>

<script setup lang="ts">

const wins = 10;
const losses = 2;

</script>

<style scoped>
.stats-container {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-columns: 1fr 1fr;
	justify-items: center;
	align-items: center;
	padding: 20px;

	width: 375px;
}

h2 {
	font-size: 50px;
	font-family: var(--arcade-font);
}

#wins {
	color: var(--primary-color)
}

#wins-count {
	font-size: 30px;
	font-family: var(--arcade-font);
	color: var(--primary-color);	
}

#losses {
	color: var(--loser-color);
}

#losses-count {
	font-size: 30px;
	font-family: var(--arcade-font);
	color: var(--loser-color);
}


</style>