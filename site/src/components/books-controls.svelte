<script>
  import { spineMode } from "../stores";
</script>

<div data-view-type={$spineMode ? 'spines' : 'grid'}>
  <button on:click={() => {
    $spineMode = !$spineMode
  }}>
Toggle Spines
  </button>
</div>

<style>

button {
  z-index: 99;
  position: fixed;
  top: 12px;
  right: 16px;
  background: white;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0,0,0,0.2);
  font-size: 14px;
  transition: transform 0.2s ease;
}

button:hover {
  transform: scale(1.05);
}

button:active {
  transform: scale(0.95);
}

</style>
