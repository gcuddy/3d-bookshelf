<script lang="ts">
  import type { Book } from "../content/config";
  import { getDimensions } from "../utils";

  export let book: Book;
  const { width, height, thickness } = getDimensions(book.dimensions);

  let isDragging = false;
  let rotateX = 0;
  let rotateY = 0;

  function interact(e: PointerEvent) {
    if (isDragging) {
      rotateX += e.movementY;
      rotateY += e.movementX;
      console.log(rotateX, rotateY);
    }
  }
</script>

<svelte:document
  on:pointerup={() => {
    isDragging = false;
  }}
/>

<div
  on:pointerdown={() => {
    console.log("pointerdown");
    isDragging = true;
  }}
  on:pointermove={interact}
  class="book-container"
  style:--height={height}
  style:--width={width}
  style:--thickness={thickness}
  style:--color={book.color.hex}
  style:width="{width}px"
  style:height="{height}px"
>
  <div
    data-book
    class="relative w-full h-full {isDragging
      ? 'cursor-grabbing'
      : 'cursor-grab'}"
    style:transform={`translateZ( -50px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`}
  >
    <slot />

    <!-- left -->
    <div data-book-left></div>

    <!-- right -->
    <div data-book-right></div>

    <!-- top -->
    <div data-book-top></div>

    <!-- bottom -->
    <div data-book-bottom></div>

    <!-- back -->
    <div data-book-back></div>
  </div>
</div>

<style>
  .book-container {
    perspective: 600px;
  }

  [data-book] {
    transform-style: preserve-3d;
    position: relative;
    width: 100%;
    height: 100%;
  }

  [data-book] > * {
    position: absolute;
  }

  [data-book-front],
  [data-book-back] {
    width: calc(var(--width) * 1px);
    height: calc(var(--height) * 1px);
  }

  [data-book-right],
  [data-book-left] {
    width: 100px;
    height: calc(var(--height) * 1px);
    left: calc ((var(--width) * 1px) / 2);
  }

  [data-book-top],
  [data-book-bottom] {
    width: calc(var(--width) * 1px);
    height: 100px;
    top: 50px;
  }

  [data-book-right] {
    transform: rotateY(90deg) translateZ(150px);
    background: gray;
  }
  [data-book-left] {
    transform: rotateY(-90deg) translateZ(150px);
    background: black;
  }

  [data-book-back] {
    transform: rotateY(180deg) translateZ(50px);
    background: red;
  }

  [data-book-top] {
    transform: rotateX(90deg) translateZ(100px);
    background: blue;
  }

  [data-book-bottom] {
    transform: rotateX(-90deg) translateZ(100px);
    background: green;
  }
</style>
