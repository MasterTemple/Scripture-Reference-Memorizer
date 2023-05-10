<script>
  import { onMount } from "svelte";
  import { references } from "./references.js";
  import { options } from "./stores.js";

  let ps = [];

  function titleCase(str) {
    return (
      str.at(0).toUpperCase() +
      str.slice(1).replace(/ \w/gim, (m) => m.toUpperCase())
    );
  }

  function getChapterCountInBook(book) {
    return references[book].length - 1;
  }

  function getVerseCountInChapter(reference) {
    const book = reference.match(/^.\D+(?= )/g)[0];
    const chapter = reference.match(/\d+$/g)[0];
    return references[book][chapter];
  }

  // i expand all references into individual verses for random selection
  async function setOptions() {
    let text = document.getElementById("selection-input").value;
    // get all verse passages
    let passages = text
      .match(
        // /((([1-3])|(Songs? of)) )?\w+( \d+)?(:[:\d,;-]+)?/g
        /((([1-3])|(Songs? of)) )?\w+( [:\d,;\- ]+)?/g
      )
      .map((p) =>
        titleCase(p).replace(/(?<=^.\D+)\d.*/g, (m) => m.replace(/\s/g, ""))
      );
    ps = passages;
    // document.getElementById("selection-options").value = passages?.join("\n") || "";

    // all the individual verses
    const verses = [];
    // expand process (passage -> verses)
    for (let p of passages) {
      // it is a whole book
      let wholeBook = p.match(/^.[^:\d]+$/g)?.[0];
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
            let c = range.match(/\d+/g)[0];
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
    console.log({ verses });
  }

  onMount(async () => {
    // default starting value
    document.getElementById("selection-input").value = `Romans 1`;
    setOptions();

    // wait 200ms so that text area is updated before reading it for contents
    document
      .getElementById("selection-input")
      .addEventListener("keydown", async () => {
        setTimeout(() => setOptions(), 200);
      });
  });
</script>

<div class="side col">
  <h3>Verse Selection</h3>
  <div id="sections" />
  <textarea class="half" name="" id="selection-input" />
  <!-- <textarea class="half" name="" disabled="true" id="selection-options" /> -->
  <h3>Verse Matches</h3>
  <div class="list">
    {#each ps as p}
      <button
        class="reference-button"
        disabled="disabled"
        style:max-width="{p.length + 4}ch"
        style:min-width="{p.length + 4}ch"
      >
        {p}
      </button>
    {/each}
  </div>
  <!-- </div> -->
</div>

<style>
  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    margin: 1rem;
    font-size: 12px;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: border-color 0.25s;
    border-color: #646cff;
    color: #646cff;
    /* flex: 1; */
  }
  button:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }

  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }

  h3 {
    text-align: center;
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
    flex: 1;
    resize: none;
    margin: 2ch;
  }

  textarea {
    background-color: #1a1a1a;
    border-radius: 8px;
    padding: 1rem;
    font-size: 14px;
  }
  .side {
    background-color: #111111;
    min-width: 34ch;
    max-width: 34ch;
    overflow: auto;
    min-height: 100vh;
    max-height: 100vh;
    padding: 0.5rem;
  }
  .list {
    /* overflow: scroll; */
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    /* flex-direction: column; */
    /* flex-grow: ; */
    flex-flow: row wrap;
    /* flex-wrap: wrap; */
    justify-content: center;
    align-items: center;
  }

  .col {
    display: flex;
    flex-direction: column;
  }
</style>
