<script>
  import { onMount } from "svelte";
  import Drawer from "svelte-drawer-component";
  import { checkDevice, isMobile } from "../utils";
  import Content from "./Content.svelte";
  import Copyright from "./Copyright.svelte";
  import History from "./History.svelte";
  import Selection from "./Selection.svelte";
  import Settings from "./Settings.svelte";
  let open = false;
  let page = "selection";

  // function swipeLeft() {
  //   $activePageIndex = Math.min($activePageIndex + 1, 2);
  // }

  // function swipeRight() {
  //   $activePageIndex = Math.max($activePageIndex - 1, 0);
  // }

  onMount(() => {
    checkDevice();
    // apparently the selection page needs to work on some devices
    // so i load it then i set the page to content once it loads
    // dont ask why
    page = "content";
  });
</script>

<!-- <div class="overflow-hidden"

use:swipe={{ onSwipeLeft: swipeLeft, onSwipeRight: swipeRight }}
style="transform: translateX(-{$activePageIndex * 100}vw);"
> -->
<!-- use:swipe={{ onSwipeLeft: swipeLeft, onSwipeRight: swipeRight }}
style="transform: translateX(-{$activePageIndex * 100}vw);" -->

{#if $isMobile}
  <div class="row container mobile">
    <div class="col main page">
      <div class="row header">
        <button on:click={() => (open = true)}>☰</button>
        <h2>Scripture Hash</h2>
      </div>
      {#if page == "content"}
        <Content />
        <Settings />
        <Copyright />
      {:else if page == "history"}
        <History />
      {:else if page == "selection"}
        <Selection />
      {/if}
    </div>
    <Drawer {open} size="100vw">
      <div id="drawer">
        <div class="col">
          <div class="row header">
            <button on:click={() => (open = false)}>☰</button>
            <h2>Scripture Hash</h2>
          </div>
          <button
            on:click={() => {
              page = "content";
              open = false;
            }}
            class:selected={page === "content"}>Home</button
          >
          <button
            on:click={() => {
              page = "history";
              open = false;
            }}
            class:selected={page === "history"}>History</button
          >
          <button
            on:click={() => {
              page = "selection";
              open = false;
            }}
            class:selected={page === "selection"}>Selection</button
          >
        </div>
      </div>
    </Drawer>
  </div>
{:else}
  <div class="row container">
    <div class="nav page">
      <History />
    </div>
    <div class="col main page">
      <h1>Scripture Hash</h1>
      <Content />
      <div>
        <Settings />
        <Copyright />
      </div>
    </div>
    <div class="selection page">
      <Selection />
    </div>
  </div>
{/if}

<!-- </div> -->

<style>
  /* @media(max-width: 768) {
    .overflow-hidden {
      overflow: hidden;
      width: 100vw;
      max-width: 100vw;
      height: 100vh;
      position: relative;
    }
    .container {
      display: flex;
      flex-wrap: nowrap;
      width: 100vw;
      max-width: 100vw;
      height: 100vh;
      overflow: hidden;
    }
    .page {
      width: 100vw;
      height: 100vh;
    }
  } */

  :global(:root) {
    --purple: #646cff;
    --green: #42b883;
    --red: #ff2929;
    --dark1: #111111;
    --dark2: #1a1a1a;
    --dark3: #222222;
  }
  h1 {
    margin-top: 4rem;
    margin-bottom: 0.5rem;
  }
  h1:hover {
    filter: drop-shadow(0 0 0.2rem var(--purple));
  }
  .container {
    display: grid;
    grid-template-columns: auto 1fr;
    height: 100vh;
  }

  .nav {
    align-self: start;
    justify-self: start;
  }

  .main {
    display: flex;
    flex: 1;
    justify-content: start;
    align-items: center;
  }

  .selection {
    align-self: end;
    justify-self: end;
  }
  .row {
    display: flex;
    flex-direction: row;
  }
  .col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    color: #ffffffde;
    background-color: #242424;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  h1 {
    display: flex;
    justify-content: center;
    font-size: 3.2em;
    line-height: 1.1;
  }
  .mobile {
    max-width: 100vw;
    max-height: 100vh;
    margin: none;
    padding: none;
  }

  .mobile .header {
    max-height: 4rem;
    width: 100vw;
    max-width: 100vw;
    align-items: center;
    /* display: flex;
    justify-content: space-between; */
    /* background-color: #1a1a1a; */
    background-color: #111111;
    position: sticky;
  }
  .mobile button {
    width: 20%;
    padding: 1rem;
    color: white;
    font-size: x-large;
    background-color: #111111;
    outline: none;
    border: none;
    height: 100%;
  }
  .mobile h2 {
    width: 80%;
    max-height: 2rem;
    align-self: center;
    margin-left: 10%;
  }
  #drawer {
    height: 100vh;
    background-color: #1a1a1a;
  }
  .selected {
    background-color: var(--purple) !important;
  }
  #drawer > div > button {
    width: 100%;
    /* height: 2rem;
    margin: 0.5rem 0;
    padding: 0; */
  }

  @media (max-width: 768) {
    .overflow-hidden {
      overflow: hidden;
      width: 100vw;
      max-width: 100vw;
      height: 100vh;
      position: relative;
    }
    .container {
      display: flex;
      flex-wrap: nowrap;
      width: 100vw;
      max-width: 100vw;
      height: 100vh;
      overflow: hidden;
      /* overflow-x: hidden !important; */
      /* scroll-behavior: none; */
      /* scroll-snap-type: x mandatory; */
    }
    .page {
      width: 100vw;
      height: 100vh;
      /* scroll-snap-align: start; */
    }
  }
</style>
