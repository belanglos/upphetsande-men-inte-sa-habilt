<script lang="ts">
  import GravityEditor from './GravityEditor.svelte';
</script>

<main>
  <h1>Gravity Text Editor</h1>
  <p class="subtitle">Type something, then wait...</p>
  <GravityEditor />
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #0a0a0a;
    color: #e0e0e0;
    font-family: 'Courier New', monospace;
    overflow: hidden;
    height: 100vh;
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    height: 100vh;
    box-sizing: border-box;
  }

  h1 {
    font-size: 1.5rem;
    color: #888;
    margin: 0 0 0.25rem 0;
  }

  .subtitle {
    font-size: 0.85rem;
    color: #555;
    margin: 0 0 1.5rem 0;
  }
</style>
