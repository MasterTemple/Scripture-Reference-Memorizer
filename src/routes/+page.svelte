<script>
  import Content from "./Content.svelte";
  import History from "./History.svelte";
  import Selection from "./Selection.svelte";
  import Settings from "./Settings.svelte";
</script>

<div class="row container">
  <div class="nav">
    <History />
  </div>
  <div class="col main">
    <h1>Scripture Reference Memorizer</h1>
    <Content />
    <Settings />
  </div>
  <div class="selection">
    <Selection />
  </div>
</div>

<style>
  h1:hover {
    filter: drop-shadow(0 0 0.2rem #646cff);
  }
  .container {
    display: grid;
    grid-template-columns: auto 1fr;
    height: 100vh;
  }

  .nav {
    align-self: start;
    justify-self: start;
  }

  .f {
    flex: 1;
  }

  .main {
    display: flex;
    flex: 1;
    justify-content: start;
    align-items: center;
  }

  .selection {
    align-self: end;
    justify-self: end;
  }
  .row {
    display: flex;
    flex-direction: row;
  }
  .col {
    display: flex;
    flex-direction: column;
  }

  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
    min-width: 100wh;
    max-width: 100wh;
  }

  h1 {
    display: flex;
    justify-content: center;
    font-size: 3.2em;
    line-height: 1.1;
  }
</style>
