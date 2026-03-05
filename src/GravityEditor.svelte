<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Matter from 'matter-js';
  import { createGravityTimer, type GravityTimer } from './lib/gravityTimer';
  import { applyExplosionImpulse } from './lib/explosionImpulse';
  import { syncLetterPositions, applyPositionsToDOM } from './lib/letterSync';

  let text = $state('');
  let letters = $state<string[]>([]);
  let gravityActive = $state(false);
  let letterElements = $state<HTMLElement[]>([]);
  let containerEl: HTMLElement;
  let inputEl: HTMLInputElement;

  let engine: Matter.Engine;
  let letterBodies: Matter.Body[] = [];
  let floorBody: Matter.Body;
  let wallLeft: Matter.Body;
  let wallRight: Matter.Body;
  let gravityTimer: GravityTimer | null = null;
  let animFrameId: number;
  let originalPositions: { x: number; y: number }[] = [];

  function getLetterStartPositions(): { x: number; y: number }[] {
    const positions: { x: number; y: number }[] = [];
    const startX = 40;
    const startY = 100;
    const charWidth = 18;
    const lineHeight = 28;
    const maxWidth = containerEl ? containerEl.clientWidth - 80 : 600;

    let currentX = startX;
    let currentY = startY;

    for (const char of letters) {
      if (currentX + charWidth > maxWidth + startX) {
        currentX = startX;
        currentY += lineHeight;
      }
      positions.push({ x: currentX, y: currentY });
      currentX += charWidth;
    }

    return positions;
  }

  function activateGravity() {
    if (gravityActive || letters.length === 0) return;
    gravityActive = true;

    originalPositions = getLetterStartPositions();

    // Create physics engine
    engine = Matter.Engine.create({ gravity: { x: 0, y: 1, scale: 0.001 } });

    const width = containerEl?.clientWidth ?? 800;
    const height = containerEl?.clientHeight ?? 600;

    // Floor and walls
    floorBody = Matter.Bodies.rectangle(width / 2, height - 5, width, 10, { isStatic: true });
    wallLeft = Matter.Bodies.rectangle(-5, height / 2, 10, height, { isStatic: true });
    wallRight = Matter.Bodies.rectangle(width + 5, height / 2, 10, height, { isStatic: true });

    Matter.Composite.add(engine.world, [floorBody, wallLeft, wallRight]);

    // Create letter bodies
    letterBodies = originalPositions.map((pos) => {
      const body = Matter.Bodies.rectangle(pos.x, pos.y, 16, 22, {
        restitution: 0.4,
        friction: 0.3,
        frictionAir: 0.01,
      });
      // Random horizontal velocity
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 3,
        y: 0,
      });
      return body;
    });

    Matter.Composite.add(engine.world, letterBodies);

    // Start physics loop
    function tick() {
      Matter.Engine.update(engine, 1000 / 60);
      const positions = syncLetterPositions(letterBodies);
      applyPositionsToDOM(letterElements, positions);
      animFrameId = requestAnimationFrame(tick);
    }
    animFrameId = requestAnimationFrame(tick);
  }

  function deactivateGravity() {
    if (!gravityActive) return;
    gravityActive = false;

    cancelAnimationFrame(animFrameId);

    if (engine) {
      Matter.Engine.clear(engine);
    }

    letterBodies = [];

    // Reset DOM positions with transition
    for (let i = 0; i < letterElements.length; i++) {
      const el = letterElements[i];
      if (el) {
        el.style.transition = 'transform 0.4s ease-out';
        el.style.transform = '';
        el.style.position = '';
        el.style.left = '';
        el.style.top = '';
        setTimeout(() => {
          el.style.transition = '';
        }, 400);
      }
    }
  }

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    text = target.value;
    letters = text.split('');
    gravityTimer?.reset();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && gravityActive) {
      // Explosion from center of viewport
      const rect = containerEl.getBoundingClientRect();
      const epicenter = {
        x: rect.width / 2,
        y: rect.height / 2,
      };
      applyExplosionImpulse(letterBodies, epicenter, { magnitude: 0.08 });
      return;
    }
    gravityTimer?.reset();
  }

  function handleClick() {
    if (gravityActive) {
      deactivateGravity();
      // Refocus input
      inputEl?.focus();
    }
  }

  onMount(() => {
    gravityTimer = createGravityTimer(activateGravity);
    inputEl?.focus();
  });

  onDestroy(() => {
    gravityTimer?.stop();
    if (gravityActive) {
      cancelAnimationFrame(animFrameId);
    }
  });
</script>

<div
  class="gravity-editor"
  bind:this={containerEl}
  role="button"
  tabindex="-1"
  onclick={handleClick}
  onkeydown={handleKeydown}
>
  <input
    bind:this={inputEl}
    type="text"
    class="text-input"
    value={text}
    oninput={handleInput}
    placeholder="Start typing..."
    class:hidden={gravityActive}
  />

  <div class="letter-container" class:active={gravityActive}>
    {#each letters as letter, i}
      <span
        class="letter"
        bind:this={letterElements[i]}
        class:falling={gravityActive}
      >{letter === ' ' ? '\u00A0' : letter}</span>
    {/each}
  </div>
</div>

<style>
  .gravity-editor {
    width: 100%;
    max-width: 800px;
    height: 500px;
    border: 1px solid #333;
    border-radius: 8px;
    position: relative;
    background: #111;
    cursor: text;
    overflow: hidden;
  }

  .text-input {
    width: calc(100% - 80px);
    padding: 1rem;
    margin: 1.5rem 2rem;
    background: transparent;
    border: none;
    border-bottom: 1px solid #333;
    color: #e0e0e0;
    font-family: 'Courier New', monospace;
    font-size: 1.1rem;
    outline: none;
  }

  .text-input.hidden {
    opacity: 0;
    pointer-events: none;
  }

  .text-input::placeholder {
    color: #444;
  }

  .letter-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .letter-container:not(.active) {
    display: none;
  }

  .letter {
    display: inline-block;
    font-family: 'Courier New', monospace;
    font-size: 1.1rem;
    color: #4fc3f7;
    user-select: none;
    will-change: transform;
  }

  .letter.falling {
    text-shadow: 0 0 8px rgba(79, 195, 247, 0.4);
  }
</style>
