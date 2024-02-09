<script lang="ts">
  import { type Book, statuses } from "../../../shared/schema";
  import { tick } from "svelte";
  export let data: {
    books: Promise<
      Array<{
        id: string;
        data: Book;
      }>
    >;
  };
</script>

<a href="/search">Search</a>

{#await data.books then books}
  <!-- {JSON.stringify(books)} -->
  <h1>Books</h1>
  <form method="post" action="?/add">
    <label>
      Enter ISBN to Add
      <input type="text" name="isbn" placeholder="isbn" />
    </label>
  </form>
  <ul>
    {#each books as book}
      <li>
        <span>{book.data.title}</span>
        <select
          on:change={async (e) => {
            await tick();
            if (!(e.target instanceof HTMLSelectElement)) {
              return;
            }
            console.log(book.data);
            console.log(
              JSON.stringify({
                ...book.data,
                status: e.target.value,
              })
            );
            const res = await fetch(`/update/${book.id}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...book.data,
                status: e.target.value,
              }),
            });
            if (res.ok) {
              console.log("success");
            } else {
              console.error("failure");
            }
          }}
          bind:value={book.data.status}
        >
          {#each statuses as status}
            <option value={status}>{status}</option>
          {/each}
        </select>
        <button
          on:click={async () => {
            await fetch(`/update/${book.id}`, {
              method: "DELETE",
            });
          }}
        >
          Delete
        </button>
      </li>
    {/each}
  </ul>
{/await}
