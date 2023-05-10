<script>
  import { history } from "./stores.js";
</script>

<div class="side col">
  <h3>History</h3>
  <div class="list col">
    {#each $history as h}
      <p
        class="element"
        class:correct={h.isCorrect}
        class:incorrect={!h.isCorrect}
      >
        {h.reference}
        {#if !h.isCorrect}
          - <span class="guess">{h.guess}</span>
        {/if}
      </p>
    {/each}
  </div>
</div>

<style>
  h3 {
    text-align: center;
  }
  .element {
    padding: 1ch;
    border-width: 2px;
    border-radius: 0.8rem;
    border-style: solid;
  }
  .guess {
    color: red;
  }
  .incorrect {
    /* color: red; */
    border-color: red;
  }
  .correct:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
  }
  .incorrect:hover {
    filter: drop-shadow(0 0 2em red);
  }
  .correct {
    /* color: green; */
    border-color: green;
  }
  * {
    background-color: #111111;
    min-width: 28ch;
  }
  .side {
    overflow: auto;
    min-height: 100vh;
    max-height: 100vh;
    /* border-radius: 8px;
    border-color: black;
    border-width: 1rem;
    border-style: solid; */
    padding: 0.5rem;
    margin: none;
    /* margin: 1rem; */
  }
  .list {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .col {
    display: flex;
    flex-direction: column;
  }
</style>
