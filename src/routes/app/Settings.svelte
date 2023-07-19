<script>
  import { isMobile } from "../utils";
  import Setting from "./Setting.svelte";
  import {
    autoFillBook,
    autoFillChapter,
    autoFillVerse,
    repeatVerse,
    sortBibleVerses,
    typeFullWord,
    typeVerseOut,
  } from "./stores";

  typeFullWord.subscribe((v) => {
    if (v) typeVerseOut.set(true);
  });
  typeVerseOut.subscribe((v) => {
    if (!v) typeFullWord.set(false);
  });
</script>

<div id="settings" class="col">
  <div class="row">
    <Setting
      isChecked={autoFillBook}
      label={$isMobile ? "Fill Book" : "Autofill Book"}
    />
    <Setting
      isChecked={autoFillChapter}
      label={$isMobile ? "Fill Chapter" : "Autofill Chapter"}
    />
    <Setting
      isChecked={autoFillVerse}
      label={$isMobile ? "Fill Verse" : "Autofill Verse"}
    />
  </div>
  <div class="row">
    <Setting isChecked={sortBibleVerses} label={"In-Order"} />
    <!-- <Setting isChecked={startAtBegininng} label={"Start From Beginning"} /> -->
    <Setting isChecked={repeatVerse} label={"Repeat"} />
  </div>
  {#if !$isMobile}
    <div class="row">
      <Setting isChecked={typeVerseOut} label={"Type Out Verse"} />
      <Setting isChecked={typeFullWord} label={"Type Out Words"} />
      <!-- <Setting isChecked={typeFullWord} label={"Word Hints"} /> -->
    </div>
  {/if}
</div>

<style>
  #settings {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  .row {
    display: flex;
    flex-direction: row;
  }
  .col {
    display: flex;
    flex-direction: column;
  }
  #settings {
    margin-top: 3rem;
  }
</style>
