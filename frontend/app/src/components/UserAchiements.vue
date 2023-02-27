<template>
  <div class="flex-container">
    <h2>Achievements</h2>
    <div class="achievement-container">
      <div v-for="achievement in achievements" :key="achievement.id">
        <font-awesome class="font-awesome" :icon="achievement.icon" @mouseenter="showDescription = achievement.id" @mouseleave="showDescription = null" />
        <p class="achievement-text" :class="{ active: showDescription === achievement.id }">{{ achievement.text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { faPenToSquare, faGamepad, faTableTennisPaddleBall, faFileImage, faTrophy, faComment, faThumbsDown, faHelmetSafety, faMedal } from '@fortawesome/free-solid-svg-icons';


const achievements = [
  { id: 1, icon: faPenToSquare, text: 'Edited player name' },
  { id: 2, icon: faGamepad, text: 'Played first game' },
  { id: 3, icon: faTableTennisPaddleBall, text: 'Played 5 games' },
  { id: 4, icon: faFileImage, text: 'Edited avatar' },
  { id: 5, icon: faTrophy, text: 'Won first game' },
  { id: 6, icon: faComment, text: 'Sent a chat message' },
  { id: 7, icon: faThumbsDown, text: 'Lost your first game' },
  { id: 8, icon: faHelmetSafety, text: 'Enabled 2FA' },
  { id: 9, icon: faMedal, text: 'Won 5 games' },
];

let showDescription: number | null = null;
</script>

<style scoped>
.flex-container {
	display: flex;
	flex-direction: column;

	padding: 20px;

	background-color: var(--box-background-color);
	box-shadow: var(--box-shadow);
	border: var(--border);
	border-radius: var(--border-radius);
}

h2 {
  font-size: 50px;
  margin-bottom: 20px;
  color: var(--primary-color);
}

.achievement-container {
	position: relative;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	justify-items: center;
	align-items: center;
	row-gap: 20px;
}
.font-awesome {
	font-size: 75px;
	opacity: .6;
	margin: 0;
}

.achievement-earned {
  opacity: 1;
}
.achievement-text {
	position: absolute;
	display: none;
	background-color: grey;
	padding: 5px;
	border-radius: 5px;
	box-shadow: 0px 0px 5px rgba(0,0,0,0.3);
}
.font-awesome:hover + .achievement-text {
  display: block;
}
.font-awesome:hover + .achievement-text {
  display: block;
}
</style>