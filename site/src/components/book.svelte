<script lang="ts">
  import { spring } from "svelte/motion";
  import type { Book } from "../content/config";
  import { getDimensions } from "../utils";

  export let book: Book;
  const { width, height, thickness } = getDimensions(book.dimensions);

  let isDragging = false;
  const springInteractSettings = { stiffness: 0.066, damping: 0.25 };

  let rotateX = spring(10, springInteractSettings);
  let rotateY = spring(-25, springInteractSettings);
  let rotateZ = 0;

  function interact(e: PointerEvent) {
    if (isDragging) {
      $rotateX -= e.movementY;
      $rotateY += e.movementX;
      console.log(rotateX, rotateY);
    }
  }

  let isRotating = true;
</script>

<svelte:document
  on:pointerup={() => {
    isDragging = false;
  }}
/>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:mouseover={() => {
    console.log("mouseover");
    if (isRotating) {
      const el = document.querySelector("[data-book]");
      const transform = window.getComputedStyle(el).transform;
      console.log(transform);

      // get current rotation
      // const values = transform.split("(")[1].split(")")[0].split(", ");
      var matrix = transform,
        _rotateX = 0,
        _rotateY = 0,
        _rotateZ = 0;

      if (matrix !== "none") {
        // do some magic
        var values = matrix.split("(")[1].split(")")[0].split(","),
          pi = Math.PI,
          sinB = parseFloat(values[8]),
          b = Math.round((Math.asin(sinB) * 180) / pi),
          cosB = Math.cos((b * pi) / 180),
          matrixVal10 = parseFloat(values[9]),
          a = Math.round((Math.asin(-matrixVal10 / cosB) * 180) / pi),
          matrixVal1 = parseFloat(values[0]),
          c = Math.round((Math.acos(matrixVal1 / cosB) * 180) / pi);

        _rotateX = a;
        _rotateY = b;
        _rotateZ = c;
      }

      rotateX.set(_rotateX, {
        hard: true,
      });
      rotateY.set(_rotateY, {
        hard: true,
      });
      rotateZ = _rotateZ;
      // $rotateX = _rotateX;
      // $rotateY = _rotateY;
      isRotating = false;
    }

    // isRotating = false;
  }}
  on:mouseout={() => {
    console.log("mouseout");
    // isRotating = true;
  }}
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
  style:--textColor={book.color.isDark ? "white" : "black"}
  style:width="{width}px"
  style:height="{height}px"
>
  <div
    data-book
    class="relative w-full h-full {isDragging
      ? 'cursor-grabbing'
      : 'cursor-grab'} {isRotating ? 'rotate' : ''}"
    style:transform={`rotateX(${$rotateX}deg) rotateY(${$rotateY}deg)`}
  >
    <slot />

    <!-- back side of front (shadow) -->
    <div data-book-front-shadow class="bg-black h-full w-full"></div>

    <!-- left -->
    <div data-book-left>
      <span class="book-spine">
        {book.title}
      </span>
    </div>

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
    width: calc(var(--thickness) * 1px);
    height: calc(var(--height) * 1px);
    /* left: calc ((var(--width) * 1px) / 2); */
  }

  [data-book-top],
  [data-book-bottom] {
    width: calc((var(--width) - 3) * 1px);
    height: calc(var(--thickness) * 1px);
    /* top: 50px; */
  }

  [data-book-right] {
    background: linear-gradient(
      90deg,
      #000 0%,
      #f9f9f9 5%,
      #fff 10%,
      #f9f9f9 15%,
      #fff 20%,
      #f9f9f9 25%,
      #fff 30%,
      #f9f9f9 35%,
      #fff 40%,
      #f9f9f9 45%,
      #fff 50%,
      #f9f9f9 55%,
      #fff 60%,
      #f9f9f9 65%,
      #fff 70%,
      #f9f9f9 75%,
      #fff 80%,
      #f9f9f9 85%,
      #fff 90%,
      #f9f9f9 95%,
      #000 100%
    );
  }

  [data-book-bottom],
  [data-book-top] {
    background: linear-gradient(
      0deg,
      #000 0%,
      #f9f9f9 5%,
      #fff 10%,
      #f9f9f9 15%,
      #fff 20%,
      #f9f9f9 25%,
      #fff 30%,
      #f9f9f9 35%,
      #fff 40%,
      #f9f9f9 45%,
      #fff 50%,
      #f9f9f9 55%,
      #fff 60%,
      #f9f9f9 65%,
      #fff 70%,
      #f9f9f9 75%,
      #fff 80%,
      #f9f9f9 85%,
      #fff 90%,
      #f9f9f9 95%,
      #000 100%
    );
  }

  [data-book-right] {
    /* transform: rotateY(90deg) translateZ(150px); */
    /* background: gray; */
    transform: translateX(calc((var(--width) - 3) * 1px)) rotateY(90deg);
    transform-origin: left;
    height: calc((var(--height) - 2) * 1px);
    top: 3px;
    /* border-top: 1px solid #f9f9f9;
    border-bottom: 1px solid #f9f9f9; */
  }
  [data-book-left] {
    /* transform: rotateY(-90deg) translateZ(150px); */
    background: var(--color);
    transform: rotateY(90deg);
    transform-origin: left;
  }

  [data-book-back] {
    transform: rotateY(180deg) translateZ(calc(var(--thickness) * 1px));
    background: var(--color);
  }

  [data-book-top] {
    /* transform: rotateX(90deg) translateZ(100px); */

    transform: translateY(3px) rotateX(-90deg);
    transform-origin: top;
  }

  [data-book-bottom] {
    /* transform: rotateX(-90deg) translateZ(100px); */
    /* background: green; */
    transform: translateY(calc((var(--height) - 3) * 1px)) rotateX(-90deg);
    transform-origin: top;
  }

  [data-book-front-shadow] {
    background: black;
    height: 100%;
    width: 100%;
    transform: rotateY(180deg);
    backface-visibility: hidden;
  }

  .book-spine {
    position: absolute;
    transform-origin: 0 0;
    transform: scale(-1, 1) rotate(90deg);
    width: calc(var(--height) * 1px);
    height: calc(var(--thickness) * 1px);
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--textColor);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .rotate {
    animation: rotate 30s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotateY(0deg) rotateX(0deg);
    }
    100% {
      transform: rotateY(360deg) rotate(90deg);
    }
  }
</style>
