<script>
  import { onMount } from "svelte";
  import { isMobile } from "../utils.js";
  import { addHistory, addTypedWord, clearTypedWords, getBookTitle, getRandomElement, getVerse, removeTypedWord } from "./functions.js";
  import { autoFillBook, autoFillChapter, options, sortBibleVerses, typeVerseOut, typedWords } from "./stores.js";

  let reference = "";
  let verse = "";
  let bookName = "";
  let chapterNumber = "";
  let verseNumber = "";
  let isCorrect;
  let bookIsCorrect;
  let chapterIsCorrect;
  let verseIsCorrect;
  let alertAnswer = false;

  let words = [];
  let isComplete = false;

  // $: words = (verse||"")?.split(/ +/g) || [];

  // change the verse whenever the verse selection options changes
  // options.subscribe(() => {
  //   if(!$options.includes(reference))
  //     changeVerse()
  // });


  async function changeVerse() {
    clearTypedWords()
    words = []
    // get next verse
    if($sortBibleVerses) {
      let index = $options.findIndex((o) => o === reference) + 1;
      if(index > $options.length - 1)
        index = 0;
      reference = $options[index]
    }
    // randomly select reference then set book/chapter/verse accordingly (along with the content)
    else
      reference = getRandomElement($options);

    bookName = reference.match(/[\w\s]+(?=\s+\d)/g)?.[0];
    chapterNumber = reference.match(/\d+(?=:)/)?.[0];
    verseNumber = reference.match(/(?<=:)\d+/)?.[0];
    verse = getVerse(reference);
    verse.then((t) => words = t.split(/\s+/g) || [])
  }

  function verify() {
    const b = document.getElementById("book").value;
    const c = document.getElementById("chapter").value;
    const v = document.getElementById("verse").value;
    // let t = document.getElementById("text").textContent;
    const t = words.join(" ")
    // remove the cursor
    // if($typeVerseOut)
    //   t = t.slice(0, t.length - 2)

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
    bookIsCorrect = getBookTitle(bookName.trim()) === b.trim();
    chapterIsCorrect = chapterNumber == c;
    verseIsCorrect = verseNumber == v;

    isCorrect = bookIsCorrect && chapterIsCorrect && verseIsCorrect;
    if($typeVerseOut)
      isCorrect = $typedWords.every((e) => e.isCorrect) && $typedWords.length > 0

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

  function handleInput(event) {
    // event.preventDefault();
    // console.log(event.data)
    // let isInsert = event.inputType === "insertText"
    let key = event.key
    let ignore = ['Control', 'Meta', 'Shift', 'Escape']
    if(ignore.includes(key))
      return
    let isDelete = key === "Backspace"
    let isEnter = key === "Enter"
    if(isEnter)
      verify();
    let guess = key
    let index = $typedWords.length
    isComplete = false
    // if(index > words.length - 1) {
    //   // index = words.length - 1
    //   // verify()
    //   return
    // }
    // document.getElementById("text").textContent = document.getElementById("text").textContent.slice(1)
    // add element
    if(isDelete)
      removeTypedWord()
    // trying to go beyond end
    else if(index > words.length - 1) {
      isComplete = true
      return
    }
    else {
      // just typed last element
      if(index > words.length - 2)
        isComplete = true
      // console.log({words, index, word: words[index]})
      let word = words[index]
      let firstLetter = word.match(/[A-z]/g)[0].toLowerCase()
      let isCorrect = firstLetter == guess
      addTypedWord(word, guess, isCorrect)
    }
    // remove element
    // if(isDelete)
    // typedVerse = event.target.textContent;
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
    document.addEventListener("keydown", (e) => {
      console.log(e.target.tagName)
      // if(e.target.tagName === "BODY")
      if(e.target.tagName !== "TEXTAREA")
        handleInput(e);
    })

    options.subscribe(() => {
      if(!$options.includes(reference))
        changeVerse()
    });
    typeVerseOut.subscribe(() => {
      clearTypedWords()
    })

  });
</script>

<div id="content" class="container">
  {#await verse}
    <h3 class="verse-content">Loading verse...</h3>
  {:then verse}
    {#if !$typeVerseOut}
      <h3 id="text"
      class="verse-content"
      class:mobile="{$isMobile}"
      class:pc="{!$isMobile}"
      class:correct="{isCorrect && alertAnswer}"
      class:incorrect="{!isCorrect && alertAnswer}"
      >{verse}</h3>
    {:else}
      <!-- <textarea class="verse-content" id="text-typer" cols="30" rows="10">
        <span>hello</span>
      </textarea> -->
      <h3 id="text"
      class="verse-content"
      class:pc="{!$isMobile}"
      readonly
      >

      <!-- contenteditable
      on:input={(e) => {e.preventDefault(); handleInput(e);}} -->
      <!-- </h3>
      <h3
      class="verse-content"
      > -->
        {#each $typedWords as w}
          <span
          class:incorrect-word={!w.isCorrect}
          >
            {w.word}
          </span>
          &nbsp;
        {/each}
      <span id="cursor"
      class:complete="{isComplete}">|</span>
      </h3>
    {/if}
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
      disabled={$autoFillBook || $typeVerseOut}
      name={bookName}
      id="book"
      value={$autoFillBook || $typeVerseOut ? bookName : ""}
    />
    <p class="space" />
    <input
      class="num-input"
      class:correct="{chapterIsCorrect && alertAnswer}"
      class:incorrect="{!chapterIsCorrect && alertAnswer}"
      style:max-width="{chapterNumber.length + 1}ch"
      type="number"
      disabled={$autoFillChapter || $typeVerseOut}
      name="chapter"
      id="chapter"
      autocomplete="off"
      value={$autoFillChapter || $typeVerseOut ? chapterNumber : ""}
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
      disabled={$typeVerseOut}
      name="verse"
      id="verse"
      autocomplete="off"
      value={$typeVerseOut ? verseNumber : ""}
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

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }

  #cursor {
    animation: blink 1s infinite;
    filter: drop-shadow(0 0 0.2em #ffffff);
  }
  .complete {
    color: var(--green);
    filter: drop-shadow(0 0 0.2em #ffffff);
  }

  .verse-content {
    padding: 2rem;
    margin: 1rem 2rem;
    border-radius: 8px;
    background-color: #1a1a1a;
    filter: drop-shadow(0 0 0.2em #000000);
  }
  .pc.verse-content {
    max-width: 60ch;
    min-width: 60ch;
  }
  .mobile.verse-content {
    width: 70vw;
  }

  .verse-content:hover {
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
		color: white;
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
  .incorrect-word {
    color: var(--red);
  }
</style>
