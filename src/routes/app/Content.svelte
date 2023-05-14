<script>
  import { onMount } from "svelte";
  import { addHistory, getBookTitle, getRandomElement, getVerse } from "./functions.js";
  import { autoFillBook, autoFillChapter, options } from "./stores.js";

  let reference;
  let verse;
  let bookName;
  let chapterNumber;
  let verseNumber;
  let isCorrect;
  let bookIsCorrect;
  let chapterIsCorrect;
  let verseIsCorrect;
  let alertAnswer = false;

  // change the verse whenever the verse selection options changes
  options.subscribe(() => {
    if(!$options.includes(reference))
      changeVerse()
  });


  // randomly select reference then set book/chapter/verse accordingly (along with the content)
  async function changeVerse() {
    reference = getRandomElement($options);
    bookName = reference.match(/[\w\s]+(?=\s+\d)/g)?.[0];
    chapterNumber = reference.match(/\d+(?=:)/)?.[0];
    verseNumber = reference.match(/(?<=:)\d+/)?.[0];
    verse = getVerse(reference);
  }

  function verify() {
    const b = document.getElementById("book").value;
    const c = document.getElementById("chapter").value;
    const v = document.getElementById("verse").value;
    const t = document.getElementById("text").textContent;

    // return if a input empty
    if (!b) {
      document.getElementById("book").focus();
      return;
    }
    if (!c) {
      document.getElementById("chapter").focus();
      return;
    }
    if (!v) {
      document.getElementById("verse").focus();
      return;
    }

    // form the guess and compare it
    const guess = `${getBookTitle(b)} ${c}:${v}`;
    // isCorrect = reference === guess;
    // make individual comparisons for more in-depth feedback
    bookIsCorrect = bookName.trim() === b.trim();
    chapterIsCorrect = chapterNumber == c;
    verseIsCorrect = verseNumber == v;

    isCorrect = bookIsCorrect && chapterIsCorrect && verseIsCorrect;

    alertAnswer = true;
    setTimeout(() => {
      alertAnswer = false;
    }, 800);

    // update the history
    addHistory(reference, isCorrect, guess, t);

    // clear and focus appropriately
    document.getElementById("verse").value = "";
    document.getElementById("verse").focus();
    if (!$autoFillChapter) {
      document.getElementById("chapter").value = "";
      document.getElementById("chapter").focus();
    }
    if (!$autoFillBook) {
      document.getElementById("book").value = "";
      document.getElementById("book").focus();
    }

    // change the verse
    changeVerse();
  }

  // on start
  onMount(async () => {
    // add event listener for enter to verify
    document.getElementById("content").addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        document.getElementById("verify-button").focus();
        verify();
      }
    });
  });
</script>

<div id="content" class="container">
  {#await verse}
    <h3 class="verse-content">Loading verse...</h3>
  {:then verse}
    <h3 id="text"
    class="verse-content"
    class:correct="{isCorrect && alertAnswer}"
    class:incorrect="{!isCorrect && alertAnswer}"
    >{verse}</h3>
  {:catch e}
    <code>{e}</code>
  {/await}
  <div id="reference-input">
    <input
      class="book-input"
      class:correct="{bookIsCorrect && alertAnswer}"
      class:incorrect="{!bookIsCorrect && alertAnswer}"
      style:max-width="{bookName.length + 1}ch"
      type="text"
      disabled={$autoFillBook}
      name={bookName}
      id="book"
      value={$autoFillBook ? bookName : ""}
    />
    <p class="space" />
    <input
      class="num-input"
      class:correct="{chapterIsCorrect && alertAnswer}"
      class:incorrect="{!chapterIsCorrect && alertAnswer}"
      style:max-width="{chapterNumber.length + 1}ch"
      type="number"
      disabled={$autoFillChapter}
      name="chapter"
      id="chapter"
      autocomplete="off"
      value={$autoFillChapter ? chapterNumber : ""}
    />
    <p class="space" />
    <p>:</p>
    <p class="space" />
    <input
      class="num-input"
      class:correct="{verseIsCorrect && alertAnswer}"
      class:incorrect="{!verseIsCorrect && alertAnswer}"
      style:max-width="{verseNumber.length + 1}ch"
      type="number"
      name="verse"
      id="verse"
      autocomplete="off"
    />
    <p class="space" />
  </div>
  <button id="verify-button"
    on:click={verify}
    class:correct="{isCorrect && alertAnswer}"
    class:incorrect="{!isCorrect && alertAnswer}"
    >Verify</button>
</div>

<style>
  .container {
    width: 55vw;
  }
  @media (max-width: 768px) {
    .container {
      width: 100vw;
    }
    input:disabled {
      opacity: 1;
      color: white;
    }
  }
  .verse-content {
    margin: 1rem 2rem;
    padding: 2rem;
    max-width: 60ch;
    border-radius: 8px;
    background-color: #1a1a1a;
    filter: drop-shadow(0 0 0.2em #000000);
  }

  h3:hover {
    filter: drop-shadow(0 0 0.8em #000000);
  }

  button:hover {
    filter: drop-shadow(0 0 0.5em #000000);
  }

  button,
  input {
    filter: drop-shadow(0 0 0.1em #000000);
  }
  button:hover,
  input:hover {
    filter: drop-shadow(0 0 0.5em #000000);
  }

  input:focus {
    border-color: var(--purple);
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

  input {
    font-size: 24px;
    color: white;
    background-color: #1a1a1a;
    border-radius: 8px;
    text-align: center;
    border: 1px solid transparent;
    padding: 0.2em 0.4em;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
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
    border-color: var(--purple);
    color: var(--purple);
  }

  button:focus,
  button:focus-visible {
    outline: 4px auto var(--purple);
  }
  input:disabled {
    opacity: 1;
  }

  .correct {
    border-width: 2px;
    border-radius: 0.8rem;
    border-style: solid;
    filter: drop-shadow(0 0 1em var(--green));
    border-color: var(--green) !important;
    color: var(--green) !important;
  }

  button:focus,
  input:focus {
    outline: none;
  }

  .correct:focus,
  .incorrect:focus {
    outline: none;
  }

  .incorrect {
    border-width: 2px;
    border-radius: 0.8rem;
    border-style: solid;
    filter: drop-shadow(0 0 1em var(--red));
    border-color: var(--red) !important;
    color: var(--red) !important;
  }
</style>
