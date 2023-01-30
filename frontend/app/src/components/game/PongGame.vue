<template>
  <div id="display-content">
    PLAYING
    <canvas id="canvas" ref="game"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  const canvas: HTMLCanvasElement = document.getElementById(
    "canvas"
  ) as HTMLCanvasElement;

  const dpi = window.devicePixelRatio;
  const style_height = +getComputedStyle(canvas)
    .getPropertyValue("height")
    .slice(0, -2);
  const style_width = +getComputedStyle(canvas)
    .getPropertyValue("width")
    .slice(0, -2);
  canvas.setAttribute("height", (style_height * dpi).toString());
  canvas.setAttribute("width", (style_width * dpi).toString());
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d", {
    alpha: false,
  }) as CanvasRenderingContext2D;
});
</script>

<style scoped>
canvas {
  height: 80%;
  width: 100%;
  color: white;
  display: block;
}
</style>
