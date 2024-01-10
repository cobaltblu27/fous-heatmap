<script lang="ts">
  import Heatmap from "./Heatmap.svelte";
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
  import type { Coordinate } from "./types";

  let json: Coordinate[] | undefined = undefined;

  function handleFilesSelect(e: any) {
    const { acceptedFiles, fileRejections } = e.detail;
    const file: File = acceptedFiles[0];
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        json = JSON.parse(reader.result as string).gazeLog;
        console.log(json);
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
  <div style="height: 80px">
  <Dropzone
    on:drop={handleFilesSelect}
    accept={"application/json"}
    inputElement={undefined}
  />
  </div>

  {#if json != null}
    <Heatmap coordinates={json}/>
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
