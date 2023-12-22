<script>
  import { onMount } from "svelte";
  import {
    blockStopWords,
    direction,
    extraContext,
    likeMatch,
    page,
    reload,
    results,
    roundingNumber,
  } from "./stores";

  function back() {
    direction.set("left");
    if ($page - 1 > 0 && $page - 1 <= $results.pageSize) page.set($page - 1);
    // pageInput = $page - 1;
    // setPageIfValid();
  }
  function next() {
    direction.set("right");
    if ($page + 1 > 0 && $page + 1 <= $results.pageSize) page.set($page + 1);
    // pageInput = $page + 1;
    // setPageIfValid();
  }
  onMount(() => {
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName.match(/text|input/gi)) return;
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") back();
    });
  });
  let x = 0;
  // validates page input
  let pageInput = $page;
  function setPageIfValid() {
    if (pageInput > 0 && pageInput <= $results.pageSize) page.set(pageInput);
  }
  page.subscribe((v) => (pageInput = v));
</script>

<div class="row search-tools">
  <button disabled={$page - 1 <= 0} on:click={back}>Previous</button>
  <div class="row">
    <p>Page</p>
    <input
      type="number"
      name=""
      class="page-input"
      bind:value={pageInput}
      on:input={setPageIfValid}
    />
    <p>/</p>
    <input
      disabled="true"
      type="number"
      name=""
      class="page-input"
      bind:value={$results.pageSize}
    />
    <!-- <p class="page-input">{results.pageSize}</p> -->
  </div>
  <!-- <button disabled={page-1<=0} on:click={back}>{page - 1}</button>
  <button disabled={page===results.pageSize} on:click={next}>{page + 1}</button> -->
  <div class="col">
    <p>Extra Context</p>
    <input
      type="range"
      name=""
      id=""
      bind:value={$extraContext}
      min="0"
      max="50"
      on:change={reload}
    />
  </div>
  <div class="col">
    <p>Match Proximity</p>
    <input
      type="range"
      name=""
      id=""
      bind:value={$roundingNumber}
      min="1"
      max="32"
      on:change={reload}
    />
  </div>
  <!-- (of, the, ...) -->
  <div class="col">
    <p>Remove Articles</p>
    <label class="switch">
      <input
        type="checkbox"
        bind:checked={$blockStopWords}
        on:change={reload}
      />
      <span class="slider round" />
    </label>
  </div>
  <!-- (resurrect matches resurrect, resurrection, resurrected, resurrecting, ...) -->
  <div class="col">
    <p>Like Matching</p>
    <label class="switch">
      <input type="checkbox" bind:checked={$likeMatch} on:change={reload} />
      <span class="slider round" />
    </label>
  </div>
  <button
    disabled={$page === $results.pageSize || $results.pageSize === 1}
    on:click={next}>Next</button
  >
</div>

<style>
  * {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    color: white;
    background-color: var(--dark3);
  }
  div.col > p {
    /* color: var(--accent); */
    color: white;
  }

  .search-tools {
    position: fixed;
    background-color: var(--dark2);
    border-radius: 10px;
    border: 2px solid var(--dark1);
    margin-top: 1rem;
    padding: 0rem 1rem;
    /* margin-bottom: 14vh; */
    z-index: 9999;
  }
  .search-tools * {
    background-color: var(--dark2);
    padding: 0.3rem;
    justify-content: center;
    justify-self: center;
    align-items: center;
    align-self: center;
    text-align: center;
  }

  .row {
    display: flex;
    flex-direction: row;
  }
  .col {
    display: flex;
    flex-direction: column;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .search-tools > div > *,
  .search-tools > button {
    border: none;
    background-color: var(--dark1);
    padding: 0.5rem;
    margin: 0.2rem;
    font-size: 16px;
    border-radius: 0.5rem;
  }
  .page-input {
    width: 4ch;
    font-size: 16px;
  }

  input:focus {
    outline: none;
    border-color: var(--accent) !important;
    border-width: 2px;
    border-style: solid;
    cursor: white;
  }

  button:disabled {
    color: var(--dim-white);
  }

  button:enabled,
  /* p:hover, */
  input:enabled {
    /* border: 1px solid var(--accent); */
    color: var(--accent);
    /* filter: drop-shadow(0 0 0.4em #00ff22); */
  }

  /* div.col > p:hover, */
  button:enabled:hover,
  span.slider:hover,
  /* p:hover, */
  input[type='number']:enabled:hover {
    border: 1px solid var(--accent);
    color: var(--accent);
    filter: drop-shadow(0 0 0.4em var(--accent));
  }
  /* button {
    border: 1px solid var(--dark2);
    background-color: var(--dark3);
    transition: background-color 1.5s;
  }
  button:active {
    color: white;
    background-color: var(--accent);
    border: 1px solid var(--accent);
  } */

  /* input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px var(--dark2) inset !important;
      outline: none;
      cursor: white;
  } */

  /* input:-webkit-autofill {
      -webkit-text-fill-color: white !important;
      outline: none;
      cursor: white;
  } */

  /* input[type='checkbox'] {
    color: var(--accent);
    background-color: var(--accent);
    fill: var(--accent);
  } */

  /* sliders */
  .switch input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  /* Style the switch */
  .switch .slider {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
    border-radius: 20px;
    background-color: var(--dim-white);
  }

  /* Style the slider knob */
  .switch .slider::before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    border-radius: 50%;
    background-color: var(--dark1);
    transition: transform 0.2s ease;
  }

  /* Style the slider when checked */
  .switch input:checked + .slider {
    background-color: var(--accent);
  }

  /* Move the slider knob when checked */
  .switch input:checked + .slider::before {
    transform: translateX(20px);
  }

  /* Rounded slider */
  .switch .slider.round {
    border-radius: 34px;
  }

  /* Rounded slider knob */
  .switch .slider.round::before {
    border-radius: 50%;
  }
  .switch span {
    padding: 0;
  }
  label.switch {
    background: none;
  }
</style>
