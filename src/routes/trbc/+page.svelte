<script>
  import { onDestroy, onMount } from "svelte";
  import ElementSelect from "./ElementSelect.svelte";
  import SearchBar from "./SearchBar.svelte";
  import SearchResults from "./SearchResults.svelte";
  import SearchTools from "./SearchTools.svelte";
  import { getSegments } from "./functions";
  import {
    blockStopWords,
    direction,
    extraContext,
    input,
    isSearching,
    likeMatch,
    page,
    reload,
    results,
    roundingNumber,
    searchIndex,
    selectedSeries,
    selectedSpeakers,
  } from "./stores";
  //   selectedSeries,
  //   selectedSpeakers,
  //   let selectedSeries = writable([]);
  //   let selectedSpeakers = writable([]);
  const searchSubscriber = searchIndex.subscribe((v) => {
    if (v > 0) search();
  });
  onDestroy(searchSubscriber);

  async function search() {
    if ($input.length === 0) return;
    if ($isSearching) return;
    isSearching.set(true);
    // if(!$page)
    //   page.set(1)
    // allows for 1 Peter 4:8 by treating 4 and 8 as separate wordsc
    let q = $input.replace(/:/g, " ");
    const url = `/search?q=${q}&p=${
      $page || 1
    }&c=${$extraContext}&b=${$blockStopWords}&l=${$likeMatch}&r=${$roundingNumber}&sp=${$selectedSpeakers.join(
      ","
    )}&sr=${$selectedSeries.join(",")}`;
    console.log("Searching...");
    results.set({
      pageSize: $results.pageSize,
      sources: [],
    });
    results.set(await getSegments(url, q, $likeMatch));
    isSearching.set(false);
    // console.log($results);
  }

  function upReload() {
    direction.set("up");
    reload();
  }

  onMount(async () => {
    page.subscribe((p) => {
      // if(!$page)
      //   page.set(1)
      // else
      reload();
    });
    extraContext.subscribe(() => direction.set("up"));
    likeMatch.subscribe(() => {
      if ($likeMatch && !$blockStopWords) blockStopWords.set(true);
      else direction.set("up");
    });

    blockStopWords.subscribe(() => {
      if (!$blockStopWords && $likeMatch) likeMatch.set(false);
      else direction.set("up");
    });
    roundingNumber.subscribe(() => direction.set("up"));
  });
</script>

<div id="sidebar">
  <ElementSelect elementType="speakers" selected={selectedSpeakers} />
  <ElementSelect elementType="series" selected={selectedSeries} />
</div>
<div id="main" class="col">
  <header id="header">
    <h1>TRBC - Search Engine</h1>
  </header>
  <div id="search" class="col">
    <SearchBar />
  </div>
  {#if $results.sources.length > 0 || $page > 1}
    <div id="results" class="col">
      <SearchResults />
    </div>
  {/if}
  <div id="search-tools" class="col">
    <SearchTools />
  </div>
  <!-- <div style='height:1vh;'></div> -->
</div>

<style>
  :global(:root) {
    --accent: #1e99fe;
    --secondary: #2196f3;
    --word-match: #ffc64b;
    --black: #000000;
    --dark0: #080808;
    --dark1: #111111;
    --dark2: #1a1a1a;
    --dark3: #222222;
    --dim-white: #bbbbbb;
    --fore-ground: #ffffff;
  }
  :global(*) {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    font-weight: normal !important;
    color: var(--fore-ground);
    background-color: var(--dark1);
  }
  #sidebar {
    float: left;
    height: 100vh;
    width: 16rem;
  }
  #main {
    display: flex;
    max-height: 100vh;
    /* overflow: hidden; */
    /* margin-right: 1rem; */
    justify-content: center;
    align-items: center;
  }
  #search-tools,
  #search {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #results {
    align-items: center;
    overflow-y: scroll;
    overflow-x: hidden;
    /* height: 73vh; */
    border-radius: 8px;
    /* box-shadow: inset 0 80px 5ch rgba(0, 0, 0, 0.5); */
    box-shadow: 0 0px 2ch rgba(0, 0, 0, 1);
  }
  #header {
    /* height: 7vh; */
  }
  #search-tools {
    /* height: 10vh; */
    margin: 4rem;
  }
  #search {
    /* height: 8vh; */
  }
  h1 {
    text-align: center;
  }
  .col {
    display: flex;
    flex-direction: column;
  }
  .row {
    display: flex;
    flex-direction: row;
  }
</style>
