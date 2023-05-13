<script>
  import { onMount } from "svelte";
  import { clearHistory } from "./functions.js";
  import { history } from "./stores.js";
  $: total = $history.length
  $: correct = $history.filter(f => f.isCorrect).length
  $: inCorrect = total - correct
  $: percent = (correct/total * 100 || 0).toFixed(0)

  let hoveredItem = null;
  let clickedItem = null;

  $: if(hoveredItem)
      if(hoveredItem != clickedItem)
        clickedItem = null;

  $: selectedItem = () => hoveredItem ? hoveredItem: clickedItem;

  onMount(() => {
    document.addEventListener("click", (e) => {
      clickedItem = parseInt(e.target.dataset.id);
      if(e.target.dataset?.id != clickedItem)
        clickedItem = null;
    })
  })
</script>

<div class="container col">
  <div class="row header">
    <!-- <img src="s" on:click={clearHistory}/> -->
    <svg
    display={$history.length? "" : "none"}
    on:click={clearHistory}
    on:keydown={()=>{}}
    class="icon icon-tabler icon-tabler-trash" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0h24v24H0z" fill="none" stroke="none"/>
      <line x1="4" x2="20" y1="7" y2="7"/>
      <line x1="10" x2="10" y1="11" y2="17"/>
      <line x1="14" x2="14" y1="11" y2="17"/>
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/>
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/>
    </svg>
    <!-- <button on:click={clearHistory}>Reset</button> -->
    <h3>History</h3>
    <h4><span class="green">{correct}</span> : <span class="red">{inCorrect}</span> = <span class="purple">{percent}%</span></h4>
  </div>
  <div class="list col">
    {#each $history as h}
      <div class="row full-width">
        <p
          data-id={h.id}
          on:mouseover={() => hoveredItem = h.id}
          on:mouseout={() => hoveredItem = null}
          on:focus={()=>{}}
          on:blur={()=>{}}
          class="element"
          class:correct={h.isCorrect}
          class:incorrect={!h.isCorrect}
        >
          {h.reference}
          {#if !h.isCorrect}
            - <span
            data-id={h.id}
            class="guess">{h.guess}</span>
          {/if}
        </p>
        {#if selectedItem() === h.id}
          <span class="tooltip"
          data-id={h.id}
          class:correct={h.isCorrect}
          class:incorrect={!h.isCorrect}
          >
            {h.content}
          </span>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>

  .container {
    background-color: #111111;
    overflow: auto;
    min-height: 100vh;
    max-height: 100vh;
    width: 20vw;
    margin: none;
  }
  svg {
    align-self: center;
    stroke: rgb(215, 215, 215);
  }
  svg:hover {
    stroke: var(--red);
  }
  .full-width {
    min-width: 100%;
    justify-content: center;
  }
  .tooltip {
    position: fixed;
    margin-left: 80ch!important;
    opacity: 1;
    z-index: 2000;
    align-self: center;
    justify-content: center;
    text-align: center;
    padding: 1ch;
    border-radius: 8px;
    background-color: #1a1a1a;
    min-width: 40ch;
    max-width: 40ch;
  }
  h3, h4 {
    text-align: center;
    align-self: center;
    justify-content: center;
    margin: 0;
  }
  .green {
    color: var(--green);
  }
  .red {
    color: var(--red);
  }
  .purple {
    color: var(--purple);
  }
  h3:hover {
    filter: drop-shadow(0 0 0.2rem var(--purple));
  }
  .tooltip,
  .element {
    padding: 1ch;
    border-width: 2px;
    border-radius: 0.8rem;
    border-style: solid;
  }
  .guess {
    color: var(--red);
  }
  .incorrect {
    border-color: var(--red);
  }
   .tooltip.correct {
    filter: drop-shadow(0 0 2em var(--green));
   }
   .tooltip.incorrect {
    border-color: var(--red);
    filter: drop-shadow(0 0 2em var(--red));
   }

   p.correct:hover {
    filter: drop-shadow(0 0 2em var(--green));
    background-color: var(--green)11;
  }
   p.incorrect:hover {
    filter: drop-shadow(0 0 2em var(--red));
    background-color: #ff000011;
  }
  .correct {
    border-color: green;
  }
  .list {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .header {
    justify-content: space-evenly;
    margin-top: 2ch;
    margin-bottom: 2ch;
  }
  .row {
    display: flex;
    flex-direction: row;
  }
  .col {
    display: flex;
    flex-direction: column;
  }
</style>
