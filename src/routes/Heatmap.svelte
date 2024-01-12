<script lang="ts">
  import { onMount } from "svelte";
  import { floatToColor } from "./heatmap";
  import type { Coordinate } from "./types";
  // @ts-ignore
  import RangeSlider from "svelte-range-slider-pips";
  import { writable } from "svelte/store";
  import Page from "./+page.svelte";

  export let coordinates: Coordinate[];

  const CANVAS_WIDTH = 540;
  const CANVAS_HEIGHT = 270;
  const HEATMAP_RADIUS = 32;

  let canvas: HTMLCanvasElement | null;
  let values = [0, coordinates.length - 1];

  const getHeatmapData = (coordinates: Coordinate[]) => {
    const heatmapData: number[][] = Array(CANVAS_WIDTH)
      .fill(0)
      .map((i) => Array(CANVAS_HEIGHT).fill(0));
    const r = CANVAS_WIDTH / (Math.PI * 2);

    coordinates.forEach((coord) => {
      const { x, y, z } = coord;
      const phi = Math.atan2(x, z) + Math.PI;
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
          const wrapX = (canvasX + i) % CANVAS_WIDTH;
          const wrapY = (canvasY + j) % CANVAS_HEIGHT;
          const heat = 1 - dist / HEATMAP_RADIUS;
          if (heatmapData[wrapX][wrapY] < heat) {
            heatmapData[wrapX][wrapY] = heat;
          }
        }
      }
    });
    return heatmapData;
  };

  const draw = (heatmapData: number[][]) => {
    const ctx = canvas?.getContext("2d");
    if (ctx == null) return;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
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
    const heatmapData = getHeatmapData(coordinates);
    draw(heatmapData);
  });

  $: {
    let rangedCoords = coordinates.slice(values[0], values[1]);
    const heatmapData = getHeatmapData(rangedCoords);
    draw(heatmapData);
  }
</script>

<div class="heatmap-container">
  <RangeSlider bind:values range={true} min={0} max={coordinates.length} pips />
  <canvas
    bind:this={canvas}
    class="heatmap-canvas"
    style="width: {CANVAS_WIDTH}px; height: {CANVAS_HEIGHT}px"
  />
</div>

<style>
  .heatmap-container {
    display: flex;
    flex-direction: column;
  }
</style>
