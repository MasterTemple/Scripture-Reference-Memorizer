<script>
  import Content from "./Content.svelte";
  import Copyright from "./Copyright.svelte";
  import History from "./History.svelte";
  import Selection from "./Selection.svelte";
  import Settings from "./Settings.svelte";
</script>

<div class="row container">
  <div class="nav">
    <History />
  </div>
  <div class="col main">
    <h1>Scripture Hash</h1>
    <Content />
    <Settings />
    <Copyright/>
  </div>
  <div class="selection">
    <Selection />
  </div>
</div>

<style>

  :global(:root) {
    --purple: #646cff;
    --green: #42b883;
    --red: #ff2929;
    --dark1: #111111;
    --dark2: #1a1a1a;
    --dark3: #222222;
  }
  h1 {
    margin-top: 4rem;
    margin-bottom: 0.5rem;
  }
  h1:hover {
    filter: drop-shadow(0 0 0.2rem var(--purple));
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
    justify-content: space-between;
  }

  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    color: #ffffffde;
    background-color: #242424;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  h1 {
    display: flex;
    justify-content: center;
    font-size: 3.2em;
    line-height: 1.1;
  }
</style>
