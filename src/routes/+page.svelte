<script>
  import App from "./app/+page.svelte";
</script>

<App/>
<!-- {#if $device === 'desktop'}
  <Desktop />
{:else}
  <Mobile />
{/if} -->
<style>
  :global(:root) {
    --purple: #646cff;
    --green: #42b883;
    --red: #ff2929;
    --dark1: #111111;
    --dark2: #1a1a1a;
    --dark3: #222222;
  }
</style>