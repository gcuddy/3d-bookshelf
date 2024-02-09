<script>
  import { spineMode } from "../stores";
</script>

<button
  on:click={() => {
    spineMode.set(true);
  }}
>
  Spines
</button>
