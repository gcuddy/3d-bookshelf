<script lang="ts">
  import type { Book } from "../../../shared/schema";

  export let book: {
    data: Book;
    id: string;
  };
</script>

<div class="flex flex-col">
  <h1
    class="text-5xl font-serif font-medium"
    style={`filter: drop-shadow(0 70px 90px ${book.data.color.rgb})`}
  >
    {book.data.title}
  </h1>
  {#if !!book.data.subtitle}
    <span class="text-2xl font-serif font-normal italic">
      {book.data.subtitle}
    </span>
  {/if}
</div>

<span class="font-serif text-lg font-normal">
  by <a class="underline" href="">{book.data.authors}</a>
</span>
{#if book.data.description}
  <p>
    {@html book.data.description}
  </p>
{/if}
