<script lang="ts">
  import type { VolumeInfo } from "./types";

  export let data: {
    results?: {
      volumeInfo: VolumeInfo;
    }[];
  };
</script>

<form action="/search">
  <input type="text" name="q" placeholder="search" />
  <button>Search</button>
</form>

<!-- {JSON.stringify(data)} -->

{#if data.results}
  <form method="post" action="/?/add">
    <ul>
      {#each data.results.slice(0, 25) as doc}
        <li>
          <span>{doc.volumeInfo.title}</span>
          <span>by {doc.volumeInfo.authors}</span>
          <img src={doc.volumeInfo.imageLinks?.thumbnail} />
          <button
            name="isbn"
            value={doc.volumeInfo.industryIdentifiers.find((i) =>
              i.type.startsWith("ISBN")
            )?.identifier}
          >
            Add this
          </button>
        </li>
      {/each}
    </ul>
  </form>
{/if}

<style>
  ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
