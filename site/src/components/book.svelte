<script lang="ts">
  import { spring, tweened } from "svelte/motion";
  import { getDimensions, round, clamp } from "../utils";
  import { activeCard, selectedCard } from "../stores";
  import { fade } from "svelte/transition";
  import BookInfo from "./book-info.svelte";
  import type { Book } from "../../../shared/schema";
  export let book: Book;
  export let id: string;
  const { width, height, thickness } = getDimensions(book.dimensions);

  $: isActive = $activeCard === id;
  $: console.log(`${id} is active: ${isActive}`);
  let isDragging = false;
  const springInteractSettings = { stiffness: 0.066, damping: 0.25 };

  let rotateX = spring(10, springInteractSettings);
  let rotateY = spring(-25, springInteractSettings);
  let scale = spring(1, {
    stiffness: springInteractSettings.stiffness * 0.5,
    damping: springInteractSettings.damping * 0.5,
  });
  let translate = spring({ x: 0, y: 0 }, springInteractSettings);
  let rotateZ = 0;

  let frontRotation = tweened(0, {
    delay: 250,
    duration: 500,
  });

  const center = () => {
    $rotateX = Math.random() * 10;
    $rotateY = Math.random() * 25 - 25;
  };

  $: if ($selectedCard === id) {
    const rect = thisBook.getBoundingClientRect();
    let scaleW = (window.innerWidth / rect.width) * 0.9;
    let scaleH = (window.innerHeight / rect.height) * 0.9;
    const newScale = Math.min(scaleW, scaleH, 2.1);
    scale.set(newScale);
    setLeft(newScale);
    frontRotation.set(-170);
    center();
  } else {
    scale.set(1);
    translate.set({ x: 0, y: 0 });
    // return x rotation to random number around 10
    center();
    frontRotation.set(0);
  }

  //   $: if (!isActive) {
  //     rotateX.set(10);
  //     rotateY.set(-25);
  //   }

  function outsideClick(node: HTMLElement, cb: (e: MouseEvent) => void) {
    const handleClick = (e: MouseEvent) => {
      if (node && !node.contains(e.target as Node)) {
        cb(e);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return {
      destroy() {
        document.removeEventListener("mousedown", handleClick);
      },
    };
  }

  function makeGradientSteps(steps: number, start = "#fff", end = "#fff") {
    const step = 100 / steps;
    let gradient = "";
    let color = "#fff";
    for (let i = 0; i < steps; i++) {
      if (i === 0) {
        color = start;
      } else if (i === steps - 1) {
        color = end;
      } else {
        color = color === "#fff" ? "#f9f9f9" : "#fff";
      }

      if (i === steps - 1) {
        gradient += `${color} 100%`;
      } else {
        gradient += `${color} ${i * step}%, `;
      }
      //   color = color === "#fff" ? "#f9f9f9" : "#fff";
    }
    console.log({ gradient });
    return gradient;
  }

  const gradientStyle = (deg = 90) =>
    `background: linear-gradient(${deg}deg, ${makeGradientSteps(
      Math.min(60, Math.round((book.pages ?? 200) / 10)),
      "#000",
      "#000"
    )})`;

  const springGlare = spring(
    {
      x: 0,
      y: 0,
    },
    springInteractSettings
  );

  let thisBook: HTMLDivElement;

  let isMouseOver = {
    front: false,
    back: false,
    spine: false,
  };

  function interact(e: PointerEvent) {
    const el = e.target as HTMLElement;
    const rect = el.getBoundingClientRect();
    const absolute = {
      x: e.clientX - rect.left, // get mouse position from left
      y: e.clientY - rect.top, // get mouse position from right
    };
    const percent = {
      x: clamp(round((100 / rect.width) * absolute.x)),
      y: clamp(round((100 / rect.height) * absolute.y)),
    };
    const center = {
      x: percent.x - 50,
      y: percent.y - 50,
    };

    if (isDragging) {
      $rotateX -= e.movementY;
      $rotateY += e.movementX;
      console.log(rotateX, rotateY);
      shouldAllowClick = false;
    } else if (isMouseOver.front && !isActive) {
      $rotateX = round(-(center.x / 2));
      $rotateY = round(center.y / 2);
    }

    springGlare.set({
      x: round(percent.x),
      y: round(percent.y),
    });
  }

  let isRotating = false;
  let shouldAllowClick = true;

  function setLeft(scale = 1) {
    const rect = thisBook.getBoundingClientRect();
    const view = document.documentElement;

    // desired x is one third of the view width
    const desiredX = view.clientWidth / 2;
    const desiredY = view.clientHeight / 2;

    const deltaX = desiredX - rect.x;

    const deltaY = desiredY - rect.y - rect.height / 2;

    const delta = {
      x: round(deltaX),
      y: round(deltaY),
    };

    translate.set(delta);
  }
</script>

<svelte:window
  on:resize={() => {
    console.log("resize");
    if ($selectedCard === id) {
      setLeft();
    }
  }}
/>

<svelte:document
  on:pointerup={() => {
    isDragging = false;
    setTimeout(() => {
      shouldAllowClick = true;
    }, 175);
  }}
/>

<!-- overlay -->
{#if $selectedCard === id}
  <div
    transition:fade
    style:background-color="rgba({book.color.value.slice(0, 3).join(",")}, 0.5)"
    class="fixed inset-0 bg-opacity-50 z-50 backdrop-blur-sm"
  ></div>
{/if}

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<a
  use:outsideClick={(e) => {
    isActive = false;
    if (
      $selectedCard === id &&
      e.target &&
      e.target instanceof HTMLElement &&
      !(e.target instanceof HTMLAnchorElement || e.target.closest("a"))
    ) {
      selectedCard.set(null);
    }
  }}
  style:view-transition-name="b-{id}"
  style:--pointer-x="{$springGlare.x}%"
  style:--pointer-y="{$springGlare.y}%"
  style:--pointer-from-center={clamp(
    Math.sqrt(
      ($springGlare.y - 50) * ($springGlare.y - 50) +
        ($springGlare.x - 50) * ($springGlare.x - 50)
    ) / 50,
    0,
    1
  )}
  href="/{id}"
  on:click={(e) => {
    e.preventDefault();

    selectedCard.set(id);
    if (!shouldAllowClick) {
    }
    console.log({ shouldAllowClick, isDragging, isRotating, click: "click" });
  }}
  on:mouseover={() => {
    console.log("mouseover");
    // activeCard.set(id);
    console.log({ $activeCard });
    if (isRotating) {
      const el = document.querySelector("[data-book]");
      if (el) {
        const transform = window.getComputedStyle(el).transform;
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
      }
      isRotating = false;
    }

    // isRotating = false;
  }}
  on:mouseout={() => {
    console.log("mouseout");
    // isRotating = true;
  }}
  on:pointerdown={(e) => {
    e.preventDefault();
    activeCard.set(id);
    console.log("pointerdown");
    isDragging = true;
  }}
  on:pointermove={interact}
  class="book-container will-change-transform"
  class:selected={$selectedCard === id}
  style:--height={height}
  style:--width={width}
  style:--thickness={thickness}
  style:--color={book.color.hex}
  style:--scale={$scale}
  style:--textColor={book.color.isDark ? "white" : "black"}
  style:width="{width}px"
  style:height="{height}px"
  style:perspective="{$selectedCard === id ? 600 * $scale : 600}px"
  style:transform={`translateX(${$translate.x}px) translateY(${$translate.y}px) translateZ(0)`}
>
  <div
    bind:this={thisBook}
    data-book
    class="relative w-full h-full shadow-2xl {isDragging
      ? 'cursor-grabbing'
      : 'cursor-grab'} {isRotating ? 'rotate' : ''}"
    style:transform={`rotateX(${$rotateX}deg) rotateY(${$rotateY}deg) scale(var(--scale))`}
  >
    <div
      class="w-full h-full relative origin-left {$selectedCard === id
        ? 'brightness-90'
        : ''}"
      style:transform={`rotateY(${$frontRotation}deg)`}
      on:mouseover={() => {
        isMouseOver.front = true;
        isMouseOver.back = false;
        isMouseOver.spine = false;
      }}
      on:mouseout={() => {
        isMouseOver.front = false;
      }}
    >
      <slot />
      <div data-glare />
    </div>
    <!-- back side of front (shadow) -->
    <div data-book-front-shadow class="bg-black h-full w-full"></div>
    {#if $selectedCard === id}
      <div
        in:fade={{
          delay: 250,
          duration: 0,
        }}
        out:fade={{
          delay: 2000,
        }}
        data-book-first-page
        class="bg-white -z-[1] w-[calc((var(--width) - 2) * 1px) border border-[#f9f9f9] h-[calc((var(--height) - 2) * 1px)] top-[1px] left-[1px] absolute overflow-auto"
      >
        <!-- <span class="font-serif text-2xl text-center">{book.title}</span> -->
        <div
          transition:fade|global={{
            delay: 600,
          }}
          class="flex flex-col px-2 py-4 items-center origin-top"
        >
          <!-- style:transform="scale({1 / $scale})" -->
          <BookInfo
            book={{
              data: book,
              id,
            }}
          />
        </div>
      </div>
    {/if}

    <!-- left -->
    <div
      data-book-left
      on:mouseover={() => {
        isMouseOver.front = false;
        isMouseOver.back = false;
        isMouseOver.spine = true;
      }}
      on:mouseout={() => {
        isMouseOver.spine = false;
      }}
    >
      <span class="book-spine">
        {book.title}
      </span>
      <div data-glare />
    </div>

    <!-- right -->
    <div data-book-right style={gradientStyle(90)}></div>

    <!-- top -->
    <div data-book-top style={gradientStyle(0)}></div>

    <!-- bottom -->
    <div data-book-bottom style={gradientStyle(0)}></div>

    <!-- back -->
    <div
      data-book-back
      on:mouseover={() => {
        isMouseOver.front = false;
        isMouseOver.back = true;
        isMouseOver.spine = false;
      }}
      on:mouseout={() => {
        isMouseOver.back = false;
      }}
    >
      <div data-glare />
    </div>
  </div>
</a>

<style>
  [data-book] {
    transform-style: preserve-3d;
    position: relative;
    width: 100%;
    height: 100%;
  }

  [data-book] > * {
    position: absolute;
  }

  [data-glare] {
    /* make sure the glare doesn't clip */
    transform: translateZ(1.41px);
    overflow: hidden;

    background-image: radial-gradient(
      farthest-corner circle at var(--pointer-x) var(--pointer-y),
      hsla(0, 0%, 100%, 0.8) 10%,
      hsla(0, 0%, 100%, 0.65) 20%,
      hsla(0, 0%, 0%, 0.5) 90%
    );

    opacity: 0.5;
    mix-blend-mode: overlay;

    width: 100%;
    height: 100%;
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

  [data-book-first-page] {
    height: calc((var(--height) - 2) * 1px);
    width: calc((var(--width) - 2) * 1px);
    background: white;
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

  .selected {
    z-index: 100;
  }

  @keyframes rotate {
    0% {
      transform: rotateY(0deg) rotateX(0deg);
    }
    100% {
      transform: rotateY(360deg) rotateX(20deg);
    }
  }
</style>
