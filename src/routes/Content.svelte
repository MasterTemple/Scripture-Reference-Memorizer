<script>
  import { onMount } from "svelte";
  import { history, options } from "./stores.js";

  let reference;
  let verse;
  let bookName;
  let chapterNumber;
  let verseNumber;

  // options.subscribe((newOptions) => (reference = getRandomElement(newOptions)));
  options.subscribe((newOptions) => changeVerse());

  async function getVerse(reference) {
    let res = await fetch(`http://127.0.0.1:3000/passage/${reference}`);
    return await res.text();
  }

  async function changeVerse() {
    reference = getRandomElement($options);
    bookName = reference.match(/[\w\s]+(?=\s+\d)/g)?.[0];
    chapterNumber = reference.match(/\d+(?=:)/)?.[0];
    verseNumber = reference.match(/(?<=:)\d+/)?.[0];
    verse = getVerse(reference);
  }

  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function verify() {
    let c = document.getElementById("chapter").value;
    let v = document.getElementById("verse").value;
    if (!c) {
      document.getElementById("chapter").focus();
      return;
    }
    if (!v) {
      document.getElementById("verse").focus();
      return;
    }
    let guess = `${bookName} ${c}:${v}`;
    let isCorrect = reference === guess;

    addHistory(reference, isCorrect, guess);
    changeVerse();
    document.getElementById("chapter").value = "";
    document.getElementById("verse").value = "";
    document.getElementById("chapter").focus();
  }

  function addHistory(r, isCorrect, guess) {
    history.update((o) => [{ reference: r, isCorrect, guess }, ...o]);
  }

  onMount(async () => {
    // changeVerse();
    document.getElementById("content").addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        document.getElementById("verify-button").focus();
        verify();
      }
    });
  });
</script>

<div id="content">
  {#await verse}
    <h3 class="verse-content">Loading verse...</h3>
  {:then verse}
    <h3 class="verse-content">{verse}</h3>
  {:catch e}
    <code>{e}</code>
  {/await}
  <div id="reference-input">
    <input
      class="book-input"
      style:max-width="{bookName.length + 1}ch"
      type="text"
      disabled="true"
      name={bookName}
      id="book"
      value={bookName}
    />
    <p class="space" />
    <input
      class="num-input"
      style:max-width="{chapterNumber.length + 1}ch"
      type="number"
      name="chapter"
      id="chapter"
      autocomplete="off"
    />
    <p class="space" />
    <p>:</p>
    <p class="space" />
    <input
      class="num-input"
      style:max-width="{verseNumber.length + 1}ch"
      type="number"
      name="verse"
      id="verse"
      autocomplete="off"
    />
    <p class="space" />
  </div>
  <button id="verify-button" on:click={verify}>Verify</button>
</div>

<style scoped>
  .verse-content {
    max-width: 60ch;
  }
  button:hover,
  input:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }

  input:focus {
    border-color: #646cff;
  }
  #content {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  #reference-input {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    align-self: center;
  }

  button {
    margin-top: 1rem;
  }

  .space {
    min-width: 0.5ch;
  }

  .verse-content {
    margin-top: 4rem;
    margin-bottom: 4rem;
  }

  input {
    font-size: 24px;
    color: white;
    background-color: #1a1a1a;
    border-radius: 8px;
    text-align: center;
    border: 1px solid transparent;
    padding: 0.2em 0.4em;
  }

  /* input.book-input {
    max-width: 6ch;
  } */

  input.translation-input {
    max-width: 4ch;
  }

  .num-input {
    /* max-width: 3ch; */
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1.5em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: border-color 0.25s;
  }

  button:hover {
    border-color: #646cff;
  }

  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
</style>
