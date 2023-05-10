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
    // ps = passages;
    document.getElementById("selection-options").value =
      passages?.join("\n") || "";

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
        // add all verses in chapter
        const verseCount = getVerseCountInChapter(wholeChapter);
        for (let v = 1; v <= verseCount; v++)
          verses.push(`${wholeChapter}:${v}`);
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
  <textarea class="half" name="" disabled="true" id="selection-options" />
  <!-- <div class="half list col">
    {#each ps as p}
      <button disabled="disabled" style:max-width={p.length + 1} ch>
        {p}
      </button>
    {/each}
  </div> -->
  <!-- </div> -->
</div>

<style>
  h3 {
    text-align: center;
  }
  #sections {
    display: flex;
    flex-direction: column;
  }

  .half {
    flex: 1;
  }
  textarea {
    flex: 1;
    resize: none;
    margin: 2ch;
  }
  .selection-inputs {
  }
  .selection-options {
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
  .correct {
    /* color: green; */
    border-color: green;
  }
  * {
    background-color: #111111;
    min-width: 34ch;
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
