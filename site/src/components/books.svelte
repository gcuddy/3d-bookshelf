<script lang="ts">
  import type { Book as TBook } from "../content/config";
  import Book from "./book.svelte";
  export let books: TBook[];
</script>

<!-- TODO: this should do the filtering, but we should still use astro images -->

{#each books as book}
  <Book {book} />
{/each}
