import * as React from 'react';
import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { cn } from '../../lib/utils';

const DEFAULT_ASCII_CHARS = '........:::=+xX#0369';
const HIGHLIGHT_LIFETIME = 280;
const CLUSTER_SIZE = 8;
const PARALLAX_EASE = 0.06;

/** Build the ASCII cell grid for one image by sampling its brightness. */
function buildHandCells(image, columns, asciiChars) {
  const rows = Math.max(
    1,
    Math.round(columns / (image.naturalWidth / image.naturalHeight || 1))
  );

  const sampler = document.createElement('canvas');
  sampler.width = columns;
  sampler.height = rows;
  const sampleCtx = sampler.getContext('2d', { willReadFrequently: true });
  const cells = new Map();
  if (!sampleCtx) return { rows, cells };

  sampleCtx.drawImage(image, 0, 0, columns, rows);
  const pixels = sampleCtx.getImageData(0, 0, columns, rows).data;
  const backgroundCharIndex = asciiChars.lastIndexOf('.');

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const offset = (row * columns + col) * 4;
      const brightness =
        (pixels[offset] * 0.299 +
          pixels[offset + 1] * 0.587 +
          pixels[offset + 2] * 0.114) /
        255;
      const charIndex = Math.min(
        asciiChars.length - 1,
        Math.floor((1 - brightness) * asciiChars.length)
      );
      if (charIndex <= backgroundCharIndex) continue;

      cells.set(`${col},${row}`, {
        col,
        row,
        char: asciiChars[charIndex],
        highlightEndTime: 0,
      });
    }
  }

  return { rows, cells };
}

/** Light up a wandering cluster of cells starting from `startCell`. */
function highlightCluster(cells, startCell) {
  const now = Date.now();
  startCell.highlightEndTime = now + HIGHLIGHT_LIFETIME;

  const steps = Math.floor(Math.random() * CLUSTER_SIZE) + 1;
  const litCells = [startCell];
  let current = startCell;

  for (let step = 0; step < steps; step++) {
    const neighbours = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbour = cells.get(`${current.col + dx},${current.row + dy}`);
        if (neighbour && !litCells.includes(neighbour)) neighbours.push(neighbour);
      }
    }
    if (neighbours.length === 0) break;

    const next = neighbours[Math.floor(Math.random() * neighbours.length)];
    next.highlightEndTime = now + HIGHLIGHT_LIFETIME + step * 8;
    litCells.push(next);
    current = next;
  }
}

export function AnimatedFooter({
  headingLines = ['ELEVEN'],
  leftImage = '',
  rightImage = '',
  background = '#04070A',
  textColor = '#ffffff',
  charColor = '#803500',
  hoverColor = '#ff6a00',
  hoverCharColor = '#0f0f0f',
  asciiChars = DEFAULT_ASCII_CHARS,
  columns = 70,
  cellSize = 18,
  fontSize = 16,
  parallaxStrength = 16,
  hoverRadius = 7,
  revealOnScroll = false,
  revealed,
  className,
}) {
  const rootRef = useRef(null);
  const leftWrapRef = useRef(null);
  const rightWrapRef = useRef(null);
  const leftCanvasRef = useRef(null);
  const rightCanvasRef = useRef(null);

  const animateInRef = useRef(() => {});
  const animateOutRef = useRef(() => {});

  const cc = charColor ?? '#803500';
  const hc = hoverColor ?? '#ff6a00';
  const hcc = hoverCharColor ?? '#0f0f0f';

  const liveRef = useRef({
    charColor: cc,
    hoverColor: hc,
    hoverCharColor: hcc,
    parallaxStrength,
    hoverRadius,
  });

  useEffect(() => {
    liveRef.current = {
      charColor: cc,
      hoverColor: hc,
      hoverCharColor: hcc,
      parallaxStrength,
      hoverRadius,
    };
  }, [cc, hc, hcc, parallaxStrength, hoverRadius]);

  const sig = useMemo(
    () =>
      JSON.stringify({
        leftImage,
        rightImage,
        columns,
        cellSize,
        fontSize,
        asciiChars,
        revealOnScroll,
        headingLines,
      }),
    [leftImage, rightImage, columns, cellSize, fontSize, asciiChars, revealOnScroll, headingLines]
  );

  useEffect(() => {
    const root = rootRef.current;
    const leftWrap = leftWrapRef.current;
    const rightWrap = rightWrapRef.current;
    if (!root || !leftWrap || !rightWrap) return;

    let isVisible = true;
    const hands = [];
    const wrappers = [leftWrap, rightWrap];

    // High-performance setup with offscreen buffer caching
    const setupHand = (image, canvas, direction) => {
      const { rows, cells } = buildHandCells(image, columns, asciiChars);
      if (cells.size === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const w = Math.round(columns * cellSize * dpr);
      const h = Math.round(rows * cellSize * dpr);
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Create static offscreen pre-rendered canvas buffer
      const buffer = document.createElement('canvas');
      buffer.width = w;
      buffer.height = h;
      const bCtx = buffer.getContext('2d', { alpha: true });
      if (bCtx) {
        bCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        bCtx.font = `${fontSize}px monospace`;
        bCtx.textAlign = 'center';
        bCtx.textBaseline = 'alphabetic';
        const metrics = bCtx.measureText('X');
        const glyphHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const baselineOffset = cellSize / 2 + glyphHeight / 2 - metrics.actualBoundingBoxDescent;

        bCtx.fillStyle = liveRef.current.charColor;
        for (const cell of cells.values()) {
          bCtx.fillText(cell.char, cell.col * cellSize + cellSize / 2, cell.row * cellSize + baselineOffset);
        }
      }

      const metrics = ctx.measureText('X');
      const glyphHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      const baselineOffset = cellSize / 2 + glyphHeight / 2 - metrics.actualBoundingBoxDescent;

      hands.push({
        canvas,
        ctx,
        buffer,
        cells,
        cellList: [...cells.values()],
        rows,
        columns,
        cellSize,
        baselineOffset,
        direction,
        activeHighlights: 0,
      });

      // Initial fast draw from buffer
      if (buffer) {
        ctx.drawImage(buffer, 0, 0, columns * cellSize, rows * cellSize);
      }
    };

    const loadHand = (src, canvas, direction) => {
      if (!src) return;
      const image = new Image();
      image.crossOrigin = 'anonymous';
      let initialized = false;
      const init = () => {
        if (initialized) return;
        initialized = true;
        setupHand(image, canvas, direction);
      };
      image.onload = init;
      image.src = src;
      if (image.complete && image.naturalWidth) init();
    };

    loadHand(leftImage, leftCanvasRef.current, 1);
    loadHand(rightImage, rightCanvasRef.current, -1);

    const renderHand = (hand, now) => {
      const { ctx, buffer, cellList, cellSize: cs, baselineOffset, columns: cols, rows } = hand;
      const { hoverColor: hc, hoverCharColor: hcc } = liveRef.current;

      let hasHighlights = false;
      for (let i = 0; i < cellList.length; i++) {
        if (cellList[i].highlightEndTime > now) {
          hasHighlights = true;
          break;
        }
      }

      if (!hasHighlights && hand.activeHighlights === 0) {
        return; // Skip redraw entirely when idle! Zero CPU usage.
      }

      hand.activeHighlights = hasHighlights ? 1 : 0;
      ctx.clearRect(0, 0, cols * cs, rows * cs);

      // Fast single blit from cached static buffer
      if (buffer) {
        ctx.drawImage(buffer, 0, 0, cols * cs, rows * cs);
      }

      // Draw only the few highlighted cells on top
      if (hasHighlights) {
        ctx.font = `${fontSize}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';

        for (let i = 0; i < cellList.length; i++) {
          const cell = cellList[i];
          if (cell.highlightEndTime > now) {
            const x = cell.col * cs;
            const y = cell.row * cs;
            ctx.fillStyle = hc;
            ctx.fillRect(x, y, cs, cs);
            ctx.fillStyle = hcc;
            ctx.fillText(cell.char, x + cs / 2, y + baselineOffset);
          }
        }
      }
    };

    const pointer = { x: 0, y: 0 };
    const drift = { x: 0, y: 0 };
    const curtain = { offset: revealOnScroll ? 125 : 0 };

    const hoverHand = (hand, clientX, clientY) => {
      const rect = hand.canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const mouseCol = ((clientX - rect.left) / rect.width) * hand.columns;
      const mouseRow = ((clientY - rect.top) / rect.height) * hand.rows;

      let closest = null;
      let closestDist = Infinity;
      for (const cell of hand.cellList) {
        const dx = mouseCol - cell.col;
        const dy = mouseRow - cell.row;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < closestDist) {
          closestDist = dist;
          closest = cell;
        }
      }
      if (closest && closestDist <= liveRef.current.hoverRadius) {
        highlightCluster(hand.cells, closest);
      }
    };

    const onMouseMove = (event) => {
      const strength = liveRef.current.parallaxStrength;
      const rect = root.getBoundingClientRect();
      const w = rect.width || 1;
      const h = rect.height || 1;
      pointer.x = ((event.clientX - rect.left) / w - 0.5) * strength * 2;
      pointer.y = ((event.clientY - rect.top) / h - 0.5) * strength * 2;
      for (const hand of hands) hoverHand(hand, event.clientX, event.clientY);
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let rafId = 0;
    const frame = () => {
      if (!isVisible) {
        rafId = requestAnimationFrame(frame);
        return;
      }
      const now = Date.now();
      for (const hand of hands) renderHand(hand, now);

      drift.x += (pointer.x - drift.x) * PARALLAX_EASE;
      drift.y += (pointer.y - drift.y) * PARALLAX_EASE;
      const strength = liveRef.current.parallaxStrength;
      const scale = 1 + (strength * 2) / 200;

      wrappers.forEach((wrapper, i) => {
        const dir = i === 0 ? 1 : -1;
        const revealX = i === 0 ? -curtain.offset : curtain.offset;
        const x = drift.x * dir || 0;
        const y = -drift.y || 0;
        wrapper.style.transform = `translateX(${revealX}%) translate(${x}px, ${y}px) scale(${scale})`;
      });

      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    const chars = gsap.utils.toArray(root.querySelectorAll('[data-af-char]'));

    const animateIn = () => {
      gsap.to(curtain, { offset: 0, duration: 1, ease: 'power3.out', overwrite: true });
      gsap.to(chars, {
        yPercent: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: { each: 0.04, from: 'center' },
        overwrite: true,
      });
    };

    const animateOut = () => {
      gsap.to(curtain, { offset: 125, duration: 0.4, ease: 'power2.in', overwrite: true });
      gsap.to(chars, {
        yPercent: 125,
        duration: 0.4,
        ease: 'power2.in',
        stagger: { each: 0.01, from: 'center' },
        overwrite: true,
      });
    };

    animateInRef.current = animateIn;
    animateOutRef.current = animateOut;

    const showAll = () => {
      gsap.set(chars, { yPercent: 0 });
    };

    let observer = null;
    if (revealed !== undefined) {
      curtain.offset = revealed ? 0 : 125;
      if (revealed) showAll();
    } else if (revealOnScroll) {
      let isRevealed = false;
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            isVisible = entry.isIntersecting;
            if (entry.isIntersecting && !isRevealed) {
              isRevealed = true;
              animateIn();
            } else if (!entry.isIntersecting && isRevealed) {
              isRevealed = false;
              animateOut();
            }
          }
        },
        { root: null, threshold: 0.01 }
      );
      observer.observe(root);
    } else {
      showAll();
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      observer?.disconnect();
      gsap.killTweensOf([curtain, ...chars]);
    };
  }, [sig]);

  useEffect(() => {
    if (revealed === undefined) return;
    if (revealed) animateInRef.current();
    else animateOutRef.current();
  }, [revealed]);

  const startsHidden = revealed !== undefined ? !revealed : revealOnScroll;
  const offEdge = startsHidden ? 125 : 0;

  return (
    <footer
      ref={rootRef}
      className={cn(
        'relative h-full w-full overflow-hidden bg-[#04070A] text-white select-none',
        className
      )}
      style={{ backgroundColor: background, color: textColor, containerType: 'inline-size' }}
    >
      {/* ASCII hands */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between">
        <div
          ref={leftWrapRef}
          className="relative w-2/5 min-w-[200px] will-change-transform"
          style={{ transform: `translateX(-${offEdge}%)` }}
        >
          <canvas ref={leftCanvasRef} className="block h-auto w-full" />
        </div>
        <div
          ref={rightWrapRef}
          className="relative w-2/5 min-w-[200px] will-change-transform"
          style={{ transform: `translateX(${offEdge}%)` }}
        >
          <canvas ref={rightCanvasRef} className="block h-auto w-full" />
        </div>
      </div>

      {/* Display headings */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-4 p-8 pointer-events-none z-10">
        {headingLines.map((word, wi) => (
          <h2
            key={`${word}-${wi}`}
            aria-label={word}
            className="overflow-hidden font-black italic leading-none tracking-tight pb-[0.15em] -mb-[0.15em] text-white"
            style={{ fontSize: 'clamp(3rem, 16cqw, 14rem)' }}
          >
            {Array.from(word).map((ch, ci) => (
              <span
                key={ci}
                data-af-char
                aria-hidden="true"
                className="inline-block"
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </h2>
        ))}
      </div>
    </footer>
  );
}

export default AnimatedFooter;
