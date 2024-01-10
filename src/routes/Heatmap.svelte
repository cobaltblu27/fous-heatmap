<script lang="ts">
  import { onMount } from "svelte";
  import { floatToColor } from "./heatmap";
  import type { Coordinate } from "./types";

  export let coordinates: Coordinate[];

  const CANVAS_WIDTH = 540;
  const CANVAS_HEIGHT = 240;
  const HEATMAP_RADIUS = 32;

  let canvas: HTMLCanvasElement | null;

  const heatmapData: number[][] = Array(CANVAS_WIDTH)
    .fill(0)
    .map((i) => Array(CANVAS_HEIGHT).fill(0));
  const r = CANVAS_WIDTH / (Math.PI * 2);
  coordinates.forEach((coord) => {
    const { x, y, z } = coord;
    const phi = Math.atan(x / z) + Math.PI;
    const rSinTheta = Math.sqrt(x * x + z * z);
    const theta = Math.PI / 2 - Math.atan(y / rSinTheta);
    const canvasX = Math.round(r * phi);
    const canvasY = Math.round(Math.cos(theta) * r + CANVAS_HEIGHT / 2);

    for (let i = -HEATMAP_RADIUS; i < HEATMAP_RADIUS; i++) {
      for (let j = -HEATMAP_RADIUS; j < HEATMAP_RADIUS; j++) {
        const dist = Math.sqrt(i * i + j * j);
        if (dist > HEATMAP_RADIUS) {
          continue;
        }
        const wrapX = canvasX + (i % CANVAS_WIDTH);
        const wrapY = canvasY + (j % CANVAS_HEIGHT);
        const heat = 1 - dist / HEATMAP_RADIUS;
        if (heatmapData[wrapX][wrapY] < heat) {
          heatmapData[wrapX][wrapY] = heat;
        }
      }
    }
  });

  const draw = () => {
    const ctx = canvas?.getContext("2d");
    if (ctx == null) return;
    heatmapData.forEach((arr, i) =>
      arr.forEach((colorData, j) => {
        const { r, g, b } = floatToColor(colorData);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(i, j, 1, 1);
      })
    );
  };

  onMount(() => {
    if (canvas == null) return;
    canvas.height = CANVAS_HEIGHT;
    canvas.width = CANVAS_WIDTH;
    draw();
  });
</script>

<div class="heatmap-container">
  <canvas
    bind:this={canvas}
    class="heatmap-canvas"
    style="width: {CANVAS_WIDTH}px; height: {CANVAS_HEIGHT}px"
  />
</div>

<style>
  .heatmap-container {
    display: flex;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin: 36px 0 0 0;
  }

  .heatmap-canvas {
  }
</style>
