<script>
  import { isMobile } from "../utils";
  import {
    autoFillBook,
    autoFillChapter,
    sortBibleVerses,
    typeFullWord,
    typeVerseOut,
  } from "./stores";
  const autoFillBookLabel = $isMobile ? "Fill Book" : "Autofill Book";
  const autoFillChapterLabel = $isMobile ? "Fill Chapter" : "Autofill Chapter";
  const sortBibleVersesLabel = "In-Order";
  const typeOutVerseLabel = "Type Out Verse";
  const typeFullWordLabel = "Type Out Words";

  typeFullWord.subscribe((v) => {
    if (v) typeVerseOut.set(true);
  });
  typeVerseOut.subscribe((v) => {
    if (!v) typeFullWord.set(false);
  });
</script>

<div id="settings" class="row">
  <div class="row setting">
    <label class="switch">
      <input type="checkbox" bind:checked={$autoFillBook} />
      <span class="slider round" />
    </label>
    <p>{autoFillBookLabel}</p>
  </div>
  <div class="row setting">
    <label class="switch">
      <input type="checkbox" bind:checked={$autoFillChapter} />
      <span class="slider round" />
    </label>
    <p>{autoFillChapterLabel}</p>
  </div>
  <div class="row setting">
    <label class="switch">
      <input type="checkbox" bind:checked={$sortBibleVerses} />
      <span class="slider round" />
    </label>
    <p>{sortBibleVersesLabel}</p>
  </div>
  {#if !$isMobile}
    <div class="row setting">
      <label class="switch">
        <input type="checkbox" bind:checked={$typeVerseOut} />
        <span class="slider round" />
      </label>
      <p>{typeOutVerseLabel}</p>
    </div>
    <div class="row setting">
      <label class="switch">
        <input type="checkbox" bind:checked={$typeFullWord} />
        <span class="slider round" />
      </label>
      <p>{typeFullWordLabel}</p>
    </div>
  {/if}
</div>

<style>
  #settings {
    display: flex;
    /* justify-content: space-evenly; */
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
  }
  #settings > div.row {
    padding: 1ch;
  }
  .setting {
    margin: 0 1ch;
    /* border-radius: 8px;
    background-color: #1a1a1a;
    filter: drop-shadow(0 0 0.2em #000000); */
  }
  .row {
    display: flex;
    flex-direction: row;
  }
  label {
    zoom: 0.7;
    align-self: center;
  }
  p {
    margin-left: 1ch;
    align-self: center;
  }
  #settings {
    margin-top: 3rem;
  }
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: var(--green);
  }

  label:hover {
    filter: drop-shadow(0 0 2em var(--green));
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>
