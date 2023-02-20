<template>
<div class="stats-container">
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

	width: auto;
	height: auto;

	background-color: var(--box-background-color);
	box-shadow: var(--box-shadow);
	border: var(--border);
	border-radius: var(--border-radius);
}

.stats-container > * {
	/* border: 1px solid white; */
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
	color: #BB000E;
}

#losses-count {
	font-size: 30px;
	font-family: var(--arcade-font);
	color: #BB000E;
}


</style>