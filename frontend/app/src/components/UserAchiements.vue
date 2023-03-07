<template>
  <div class="flex-container box-styling">
    <h2>Achievements</h2>
    <div class="achievement-container">
      <div v-for="achievement in achievements" :key="achievement.id">
        <font-awesome
          class="font-awesome"
          :style="[
            achievementEarned(achievement.id)
              ? { opacity: 1 }
              : { opacity: 0.1 },
          ]"
          :icon="achievement.icon"
        />
        <p
          class="achievement-text"
          :class="{ active: showDescription === achievement.id }"
        >
          {{ achievement.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  faPenToSquare,
  faGamepad,
  faTableTennisPaddleBall,
  faFileImage,
  faTrophy,
  faThumbsDown,
  faHelmetSafety,
  faMedal,
  faSadTear,
} from "@fortawesome/free-solid-svg-icons";

type Achievement = {
  id: number;
  name: string;
  icon: string;
};

const props = defineProps({
  chievs: { type: Array<Achievement>, required: true },
});

const achievements = [
  { id: 0, icon: faFileImage, name: "Updated Avatar" },
  { id: 1, icon: faTrophy, name: "Won First Game" },
  { id: 2, icon: faThumbsDown, name: "Lost First Game" },
  { id: 3, icon: faHelmetSafety, name: "Enabled 2FA" },
  { id: 4, icon: faPenToSquare, name: "Updated Player Name" },
  { id: 5, icon: faGamepad, name: "Played First Game" },
  { id: 6, icon: faTableTennisPaddleBall, name: "Played 5 Games" },
  { id: 8, icon: faMedal, name: "Won 5 games" },
  { id: 9, icon: faSadTear, name: "Lost 5 games" },
];
function achievementEarned(id: number) {
  if (props.chievs.find((achievement: Achievement) => achievement.id === id))
    return 1;
  return 0;
}

const showDescription: number | null = null;
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: column;
  width: 375px;

  padding: 20px;
}

h2 {
  font-size: 50px;
  margin-bottom: 20px;
  /* color: var(--primary-color); */
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
  opacity: 0.1;
  margin: 0;
}

.achievement-text {
  position: absolute;
  display: none;
  background-color: grey;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
}
.font-awesome:hover + .achievement-text {
  display: block;
}
.font-awesome:hover + .achievement-text {
  display: block;
}
</style>
