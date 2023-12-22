<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { get } from "./functions";
  import { reload } from "./stores";

  export let elementType;
  let searchTerm = "";
  //   let selected = writable([]);
  export let selected;

  function addElement(id) {
    selected.set([...$selected, id]);
    reload();
  }
  function removeElement(id) {
    selected.set($selected.filter((e) => e != id));
    reload();
  }

  let elements = writable([]);
  async function getElements() {
    elements.set(await get(`/${elementType}`));
    console.log({ elementType, $elements });
  }
  onMount(async () => {
    getElements();
  });
</script>

<div id="everything">
  <input
    type="text"
    id="searchbar"
    class="searchbar"
    bind:value={searchTerm}
    placeholder="Search {elementType}"
    on:keydown={(e) => {
      if (e.key == "Enter") {
        let els = $elements.filter(
          (element) =>
            element?.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !$selected.includes(element.id)
        );
        if (els.length > 0) addElement(els[0].id);
        searchTerm = "";
      }
    }}
  />

  {#if $elements?.length > 0}
    <ul>
      {#each $elements.filter((element) => element.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) && !$selected.includes(element.id)) as element}
        <li
          class:selected={$selected.includes(element.id)}
          class="result"
          on:click={() => {
            addElement(element.id);
            searchTerm = "";
          }}
        >
          {element.name}
        </li>
      {/each}
    </ul>
  {/if}

  <h2>Selected {elementType}:</h2>
  <ul>
    {#each $selected as id}
      <li
        class="result"
        on:click={() => {
          removeElement(id);
        }}
      >
        {$elements.find((element) => element.id === id)?.name}
      </li>
    {/each}
  </ul>
</div>

<style>
  * {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    color: white;
    /* background-color: var(--dark3); */
  }
  h2 {
    font-size: 22px;
    margin-left: 1rem;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
  }
  #everything {
    margin-left: 0.5rem;
  }
  .searchbar {
    justify-content: center;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
    padding: 0.5rem;
    width: 14rem;
    font-size: 18px;
    background-color: var(--dark2);
    outline: none;
    border: 2px solid var(--dark2);
    border-radius: 8px;
    filter: drop-shadow(0 0 0.2em var(--black));
    caret-color: white;
  }

  .result {
    justify-content: center;
    margin: 0.5rem;
    padding: 0.5rem;
    width: fit-content;
    font-size: 14px;
    background-color: var(--black);
    outline: none;
    border: 1px solid var(--accent);
    border-radius: 8px;
    filter: drop-shadow(0 0 0.2em var(--black));
    caret-color: white;
    list-style-type: none;
    list-style-position: inside;
    margin-left: 2rem;
  }
  ul {
    /* background-color: var(--dark0); */
    padding: 0rem;
    margin: 0rem;
    overflow: auto;
    height: 8rem;
    border-radius: 8px;
    /* box-shadow: 0 0px 2ch rgba(0, 0, 0, 1); */
    box-shadow: inset 0 0px 1ch rgba(0, 0, 0, 1);
    background-color: var(--dark0);

    /* box-shadow: inset 0 80px 5ch rgba(0, 0, 0, 0.5); */
  }

  #searchbar:active,
  input:active,
  #searchbar:focus,
  input:focus {
    border: 1px solid var(--accent);
    /* cursor: white; */
  }
  #searchbar:-webkit-autofill,
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px var(--dark2) inset !important;
    outline: none;
    border: 1px solid var(--accent);
    /* cursor: white; */
  }

  #searchbar:-webkit-autofill,
  input:-webkit-autofill {
    -webkit-text-fill-color: white !important;
    /* outline: none; */
    border: 1px solid var(--accent);
    border-radius: 8px;
    /* cursor: white; */
  }
  .row {
    display: flex;
    flex-direction: row;
  }
</style>
