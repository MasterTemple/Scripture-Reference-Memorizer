<script>
  import { afterUpdate, onMount } from "svelte";
  import { get, mergeSegments } from "../functions";
  import { trackCurrentLine } from "../stores";
  import { currentTime } from "./../stores.js";

  export let id;
  export let time;

  let containerElement;
  let segments = [];
  let currentSegmentIndex;
  let currentSegment;
  let nextSegment;
  var computerIsScrolling = false;

  currentTime.subscribe((t) => {
    if (t > nextSegment?.start_time) setSegments();
  });
  trackCurrentLine.subscribe((v) => {
    console.log(v);
  });

  function setSegments() {
    currentSegmentIndex =
      segments.findIndex(
        (s) => s.start_time <= $currentTime && $currentTime < s.end_time
      ) || 0;
    currentSegment = segments[currentSegmentIndex];
    nextSegment = segments[currentSegmentIndex + 1];
    if ($trackCurrentLine) {
      scrollToCurrentLine();
    }
  }

  function setAudioTime(time) {
    currentTime.set(time);
    trackCurrentLine.set(true);
  }
  function scrollToCurrentLine() {
    scrollTo(document.querySelector(".search-result"));
    // computerIsScrolling = true;
    // setTimeout(() => trackCurrentLine.set(true), 20);
    // setTimeout(() => {
    //   if ($trackCurrentLine) {
    //     // trackCurrentLine.set(true);
    //   }
    // }, 100);
  }
  function scrollTo(el) {
    if (el)
      // computerIsScrolling = true;
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    trackCurrentLine.set(true);
    //   computerIsScrolling = false;
  }
  onMount(async () => {
    segments = await get(`/transcript?id=${id}`);
    segments = mergeSegments(segments);
    document.addEventListener("click", (event) => {
      let element = event.target;
      const time = parseFloat(element.dataset.time);
      if (!isNaN(time)) {
        setAudioTime(time);
        setSegments();
      }
    });

    // break auto scroll when user scrolls
    containerElement.addEventListener("scroll", (e) => {
      //   console.log({ computerIsScrolling });
      if (computerIsScrolling) {
        trackCurrentLine.set(true);
      } else {
        trackCurrentLine.set(false);
      }
      computerIsScrolling = false;
    });

    setAudioTime(time);
    setSegments();
  });
  afterUpdate(setSegments);
</script>

<div id="transcript" class="scroll" bind:this={containerElement}>
  {#await segments}
    <p>Loading Transcript...</p>
  {:then segments}
    <!-- {#each groupSegments(segments) as segmentGroup} -->
    {#each segments as s, i}
      <p
        data-time={s.start_time}
        class:search-result={s.start_time <= $currentTime &&
          $currentTime < s.end_time}
      >
        {s.content + " "}
      </p>
      <!-- {/each} -->
    {/each}
  {/await}
</div>

<style>
  p {
    background: none;
    font-size: larger;
  }
  p:hover,
  .search-result {
    /* filter: drop-shadow(0 0 0.4em var(--word-match)); */
    /* filter: drop-shadow(0 0 0.2em var(--dark0)); */
    color: var(--word-match);
    cursor: pointer;
    /* color: var(--word-match); */
  }
  div,
  div p {
    display: inline;
    overflow-wrap: break-word;
    white-space: normal;
    line-height: 3ch;
    word-spacing: 0.3ch;
  }
  #transcript {
    overflow-y: scroll;
    /* max-height: 60vh; */
    max-height: 20rem;
    /* max-width: 100ch;
    min-height: 60vh;
    min-width: 100ch; */
    margin-right: 4vw;
    padding: 3rem;
    border-radius: 8px;
    background-color: var(--dark1);
  }
</style>
