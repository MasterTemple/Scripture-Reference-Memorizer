<script>
  import { history } from "./stores.js";
  $: total = $history.length
  $: correct = $history.filter(f => f.isCorrect).length
  $: inCorrect = total - correct
  $: percent = (correct/total * 100 || 0).toFixed(0)
</script>

<div class="side col">
  <!-- <h3>History: <span class="green">{correct}</span> + <span class="red">{inCorrect}</span> = <span class="purple">{total}</span></h3> -->
  <div class="row header">
    <h3>History</h3>
    <!-- <h4><span class="green">{correct}</span> + <span class="red">{inCorrect}</span> = <span class="purple">{total}</span></h4> -->
    <h4><span class="green">{correct}</span> : <span class="red">{inCorrect}</span> = <span class="purple">{percent}%</span></h4>
  </div>
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
  h3, h4 {
    text-align: center;
    align-self: center;
    justify-content: center;
    margin: 0;
  }
  h3 {
    /* margin-top: 2ch; */
  }

  h4 {
    /* margin-top: 2ch; */
    /* margin-bottom: 2ch; */
  }
  .green {
    color: #42b883;
  }
  .red {
    color: red;
  }
  .purple {
    color: #646cff;
  }
  h3:hover {
    filter: drop-shadow(0 0 0.2rem #646cff);
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
    border-color: red;
  }
   p.correct:hover {
    filter: drop-shadow(0 0 2em #42b883);
    background-color: #42b88311;
  }
   p.incorrect:hover {
    filter: drop-shadow(0 0 2em red);
    background-color: #ff000011;
  }
  .correct {
    border-color: green;
  }
  div.side {
    background-color: #111111;
    min-width: 36ch;
  }
  .side {
    overflow: auto;
    min-height: 100vh;
    max-height: 100vh;
    margin: none;
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
