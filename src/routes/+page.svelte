<script lang="ts">
  import Heatmap from "./Heatmap.svelte";
  import type { Coordinate } from "./types";

  let json: Coordinate[] | undefined = undefined;
  let files: FileList;

  $: if (files) {
    const file = files[0];
    const reader = new FileReader();
    console.log(file);
    reader.addEventListener(
      "load",
      () => {
        json = JSON.parse(reader.result as string).gazeLog;
      },
      false
    );
    reader.readAsText(file);
  }
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <div style="height: 40px">
    <input
      accept="application/json"
      bind:files
      id="file-input"
      type="file"
    />
  </div>

  {#if json != null}
    <Heatmap coordinates={json} />
  {/if}
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
  }
</style>
