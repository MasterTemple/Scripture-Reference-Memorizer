<script>
  import { onMount } from "svelte";
  import { isMobile } from "../utils.js";
  import { getChapterCountInBook, getPassagesFromText, getVerseCountInChapter } from "./functions.js";
  import { options, optionsInput } from "./stores.js";

  let ps = [];
  let previousInput = "";

  // i expand all references into individual verses for random selection
  async function setOptions() {
    let text = document.getElementById("selection-input").value;
		optionsInput.set(text)
    // change, not just keypress
    if(text === previousInput) return
    previousInput = text

    let passages = getPassagesFromText(text)
    if(passages.length === 0) return
    ps = passages;

    // all the individual verses
    const verses = [];
    // expand process (passage -> verses)
    for (let p of passages) {
      // it is a whole book
      let wholeBook = p.match(/^\d?[^:\d]+$/g)?.[0].trim();
      let wholeChapter = p.match(/^[^:]+\d$/g)?.[0];
      if (wholeBook) {
        // add all chapters
        const chapterCount = getChapterCountInBook(wholeBook);
        for (let c = 1; c <= chapterCount; c++) {
          // add all verses
          const verseCount = getVerseCountInChapter(`${wholeBook} ${c}`);
          for (let v = 1; v <= verseCount; v++)
            verses.push(`${wholeBook} ${c}:${v}`);
        }
      }
      // it is a chapter
      else if (wholeChapter) {
        // range of chapters
        const ranges = wholeChapter.split(",");
        const book = wholeChapter.match(/^.\D+(?= )/g)[0];
        for (let range of ranges) {
          // add everything in range (ex: 1-3)
          if (range.match(/\d+\-\d+/g)) {
            const [start, end] = range.match(/\d+/g);
            for (let c = start; c <= end; c++) {
              const verseCount = getVerseCountInChapter(`${book} ${c}`);
              for (let v = 1; v <= verseCount; v++)
                verses.push(`${book} ${c}:${v}`);
            }
          }
          // add the single value (ex: 2)
          else {
            let c = range.match(/\d+$/g)[0];
            const verseCount = getVerseCountInChapter(`${book} ${c}`);
            for (let v = 1; v <= verseCount; v++)
              verses.push(`${book} ${c}:${v}`);
          }
        }
      }
      // it is a selection
      else {
        // book
        const book = p.match(/^.\D+(?= )/g)[0];
        // all numbers
        const rest = p.slice(book.length).replace(/\s+/g, "");
        // chaptered sections
        const sections = rest.split(";");
        // loop over every chapter section
        for (let section of sections) {
          // remove chapter from string
          const chapter = section.match(/^\d+/g)[0];
          section = section.replace(/^\d+:/g, "");
          // verse ranges in chapter
          const ranges = section.split(",");
          for (let range of ranges) {
            // add everything in range (ex: 1-3)
            if (range.match(/\d+\-\d+/g)) {
              const [start, end] = range.match(/\d+/g);
              for (let v = start; v <= end; v++) {
                verses.push(`${book} ${chapter}:${v}`);
              }
            }
            // add the single value (ex: 2)
            else {
              let v = range.match(/\d+/g)[0];
              verses.push(`${book} ${chapter}:${v}`);
            }
          }
        }
      }
    }
    // set options
    if ($options.toString() !== verses.toString()) options.set(verses);
    // console.log({ verses });
  }

  onMount(async () => {
    // default starting value
    document.getElementById("selection-input").value = $optionsInput ? $optionsInput : `Romans 3:12`;
    setOptions();

    // wait 200ms so that text area is updated before reading it for contents
    document
      .getElementById("selection-input")
      .addEventListener("keydown", async () => {
        setTimeout(() => setOptions(), 200);
      });
  });
</script>

<div class="container col"
  class:mobile="{$isMobile}"
>
  <h3>Verse Selection</h3>
  <div id="sections" />
  <textarea class="half" name="" id="selection-input" />
  <h3>Verse Matches</h3>
  <div class="list">
    {#each ps as p}
      <button
        class="reference-button"
        disabled="disabled"
        style:max-width="{p.length + 2}ch"
        style:min-width="{p.length + 2}ch"
      >
        {p}
      </button>
    {/each}
  </div>
</div>

<style>
  .mobile.container {
    width: 100vw;
  }
  .container {
    background-color: #111111;
    overflow: auto;
    min-height: 100vh;
    max-height: 100vh;
      width: 25vw;
    margin: none;
  }
  @media (max-width: 768px) {
    .container {
      width: 100vw;
    }
  }
  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.4em;
    margin: 0.4rem;
    font-size: 12px;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: border-color 0.25s;
    border-color: var(--purple);
    color: #ffffffcc;
  }

  textarea:focus,
  textarea:hover {
    /* border: none; */
    outline: none;
    border-color: #111111;
    filter: drop-shadow(0 0 0.5em #000000);
  }
  button:hover {
    color: white;
    filter: drop-shadow(0 0 0.5em var(--purple)aa);
  }

  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }

  h3 {
    text-align: center;
  }

  h3:hover {
    filter: drop-shadow(0 0 0.2rem var(--purple));
  }
  #sections {
    display: flex;
    flex-direction: column;
  }

  .half {
    flex: 1;
    min-height: 40vh;
    max-height: 40vh;
  }
  textarea {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    flex: 1;
    resize: none;
    margin: 2ch;
    border-color: #111111;
		color: white;
    background-color: #1a1a1a;
    border-radius: 8px;
    padding: 1rem;
    font-size: 14px;
  }
  .list {
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-evenly;
    align-items: center;
  }

  .col {
    display: flex;
    flex-direction: column;
  }
  @media(max-width: 768) {
    textarea {
       user-select: none; /* standard */
       -moz-user-select: none; /* Firefox specific */
       -webkit-user-select: none; /* Chrome, Opera and Safari*/
       -ms-user-select: none; /* IE, MS Edge */
     }
  }
</style>
