<script>
  import { onMount } from "svelte";
  import { references } from "./references.js";
  import { options } from "./stores.js";

  function getChapterCountInBook(book) {
    // const book = reference.match(/^.\D+(?= )$/g)?.[0];
    console.log(book);
    return references[book].length - 1;
  }

  function getVerseCountInChapter(reference) {
    const book = reference.match(/^.\D+(?= )/g)[0];
    const chapter = reference.match(/\d+$/g)[0];
    return references[book][chapter];
  }

  async function setOptions() {
    let text = document.getElementById("selection-input").value;
    // get all verse passages
    let passages = text.match(
      // /((([1-3])|(Songs? of)) )?\w+( \d+)?(:[:\d,;-]+)?/g
      /((([1-3])|(Songs? of)) )?\w+( [:\d,;-]+)?/g
    );
    document.getElementById("selection-options").value =
      passages?.join("\n") || "";
    console.log({ passages });
    // let fullBooks = [];
    // let fullChapters = [];
    // let verseRange = [];
    const verses = [];
    for (let p of passages) {
      // it is a whole book
      let wholeBook = p.match(/^.[^:\d]+$/g)?.[0];
      let wholeChapter = p.match(/^[^:]+\d$/g)?.[0];
      if (wholeBook) {
        const chapterCount = getChapterCountInBook(wholeBook);
        for (let c = 1; c <= chapterCount; c++) {
          const verseCount = getVerseCountInChapter(`${wholeBook} ${c}`);
          for (let v = 1; v <= verseCount; v++)
            verses.push(`${wholeBook} ${c}:${v}`);
        }
      }
      // it is a chapter
      else if (wholeChapter) {
        const verseCount = getVerseCountInChapter(wholeChapter);
        for (let v = 1; v <= verseCount; v++)
          verses.push(`${wholeChapter}:${v}`);
      }
      // it is a selection
      else {
        // book
        const book = p.match(/^.\D+(?= )/g)[0];
        const rest = p.slice(book.length).replace(/\s+/g, "");
        const sections = rest.split(";");
        // loop over every chapter section
        for (let section of sections) {
          const chapter = section.match(/^\d+/g)[0];
          section = section.replace(/^\d+:/g, "");
          const ranges = section.split(",");
          for (let range of ranges) {
            if (range.match(/\d+\-\d+/g)) {
              const [start, end] = range.match(/\d+/g);
              for (let v = start; v <= end; v++) {
                verses.push(`${book} ${chapter}:${v}`);
              }
            } else {
              let v = range.match(/\d+/g)[0];
              verses.push(`${book} ${chapter}:${v}`);
            }
          }
        }
      }
    }
    // console.log({ fullBooks, fullChapters, verseRange });
    // passages = await Promise.all(passages.map((p) => getVerseCount(p)));
    // break it into individual verses
    options.update(() => verses);
  }
  onMount(async () => {
    document.getElementById("selection-input").value = `Romans 1`;
    setOptions();
    document
      .getElementById("selection-input")
      .addEventListener("keydown", async () => {
        setTimeout(() => setOptions(), 200);
        // setOptions();
      });
  });
</script>

<div class="side col">
  <h3>Verse Selection</h3>
  <div id="sections" />
  <textarea name="" id="selection-input" />
  <textarea name="" disabled="true" id="selection-options" />
</div>

<style>
  h3 {
    text-align: center;
  }
  #sections {
    display: flex;
    flex-direction: column;
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
