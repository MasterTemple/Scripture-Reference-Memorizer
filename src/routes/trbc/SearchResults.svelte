<script>
  // import { beforeUpdate } from "svelte";
  import { fly } from "svelte/transition";
  import { direction, results } from "./stores";

  let d = 120;
  let x = d;
  let y = 0;
  direction.subscribe((v) => {
    if (v === "right") {
      x = d;
      y = 0;
    } else if (v === "left") {
      x = -1 * d;
      y = 0;
    } else {
      x = 0;
      y = d;
    }
  });
</script>

{#if $results.sources.length > 0}
  {#each $results.sources as result}
    <div
      class="result-card col"
      in:fly={{ x: x, y: y, duration: 300 }}
      out:fly={{ x: 0, y: d, duration: 300 }}
    >
      <a href="/trbc/source?id={result.source.id}" class="source-name"
        >{result.source.name
          .replace(/(^\d+|\.[^\.]+$)/g, "")
          .replace(/[-]/g, " ")
          .replace(/(â€œ|â€)/g, '"')}</a
      >
      <p>
        <!-- {#each mergeSegments(result.segments) as segment} -->
        {#each result.segments as segment}
          <!-- i could mathematically break it down by character width and link it that way with a ch width for the size -->
          <!-- <span href="/source?id={result.source.id}&start={segment.start}" class="link"> -->
          <a
            href="/trbc/source?id={result.source.id}&start={segment.start_time}"
          >
            {#each segment.content as content}
              <span class:word-match={content.isMatch}>{content.word} </span>
            {/each}
          </a>
          <!-- </span> -->
        {/each}
      </p>
    </div>
  {/each}
{/if}

<style>
  .result-card {
    width: 60vw;
    word-wrap: break-word;
    border-radius: 8px;
    border-color: black;
    border-width: 2px;
    border-style: solid;
    padding: 1rem;
    margin: 1rem;
    filter: drop-shadow(0 0 0.2em var(--black));
  }
  .result-card:hover {
    filter: drop-shadow(0 0 0.4em var(--black));
  }
  .result-card,
  .result-card h3,
  .result-card span,
  .result-card a,
  .result-card p {
    background-color: var(--dark2);
  }

  .word-match {
    color: var(--word-match);
  }

  a {
    color: white;
    background-color: none;
    text-decoration: none;
  }
  .source-name {
    font-size: large;
  }
  .source-name:hover {
    /* color: var(--secondary); */
  }
  p,
  a {
    line-height: 3ch;
  }
  p span,
  p a {
    /* display: inline; */
    /* display: contents; */
    /* white-space: nowrap; */
    /* overflow-wrap: break-word; */

    display: inline;
    overflow-wrap: break-word;
    white-space: normal;
  }
  a:hover,
  a span:hover {
    color: var(--accent) !important;
  }
</style>
