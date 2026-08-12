import { useRef, useEffect, useCallback, memo } from 'react';
import { hexToRgb } from '../utils/constellationThemes';

/**
 * ConstellationCanvas — Live animated constellation background rendered on HTML Canvas.
 * Uses requestAnimationFrame for smooth animation.
 * Pauses when off-screen via IntersectionObserver.
 * Cleans up properly on unmount.
 *
 * @param {Object} props
 * @param {Object} props.config - Constellation configuration from generateConstellationConfig()
 * @param {boolean} props.isHovered - Whether the parent card is hovered
 */
const ConstellationCanvas = memo(function ConstellationCanvas({ config, isHovered }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const isVisibleRef = useRef(true);
  const isHoveredRef = useRef(false);
  const stateRef = useRef(null);
  const timeRef = useRef(0);

  // Keep hover ref in sync
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Deep-clone initial state from config for mutation during animation
  const initState = useCallback(() => {
    return {
      nodes: config.nodes.map((n) => ({ ...n })),
      stars: config.stars.map((s) => ({ ...s })),
      particles: config.particles.map((p) => ({ ...p })),
    };
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize mutable state
    stateRef.current = initState();
    timeRef.current = 0;

    const [pr, pg, pb] = hexToRgb(config.theme.primary);
    const [gr, gg, gb] = hexToRgb(config.theme.glow);
    const [parR, parG, parB] = hexToRgb(config.theme.particle);

    // Resize handler
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    // Intersection observer to pause when off-screen
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !animRef.current) {
          animRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(canvas);

    // Animation loop
    function animate() {
      if (!isVisibleRef.current) {
        animRef.current = null;
        return;
      }

      const state = stateRef.current;
      if (!state) return;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      const time = timeRef.current;
      const hovered = isHoveredRef.current;
      const brightMult = hovered ? 1.5 : 1.0;
      const speed = config.animationSpeed;

      // Clear
      ctx.clearRect(0, 0, w, h);

      // --- Layer 1: Dark background with subtle radial gradient ---
      const bgGrad = ctx.createRadialGradient(
        w * config.nebulaX,
        h * config.nebulaY,
        0,
        w * config.nebulaX,
        h * config.nebulaY,
        w * config.nebulaRadius
      );
      bgGrad.addColorStop(0, `rgba(${pr}, ${pg}, ${pb}, ${0.06 * config.glowIntensity * brightMult})`);
      bgGrad.addColorStop(0.5, `rgba(${pr}, ${pg}, ${pb}, ${0.02 * config.glowIntensity * brightMult})`);
      bgGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // --- Layer 2: Static star field (twinkle) ---
      for (const star of state.stars) {
        const sx = star.x * w;
        const sy = star.y * h;
        const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(time * star.twinkleSpeed + star.twinklePhase));
        const alpha = twinkle * 0.6 * brightMult;

        ctx.beginPath();
        ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${parR}, ${parG}, ${parB}, ${Math.min(alpha, 1)})`;
        ctx.fill();
      }

      // --- Layer 3: Update and draw floating particles ---
      for (const p of state.particles) {
        p.x += p.vx * speed;
        p.y += p.vy * speed;

        // Wrap around
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y > 1.05) p.y = -0.05;

        const px = p.x * w;
        const py = p.y * h;
        const alpha = p.alpha * brightMult;

        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${parR}, ${parG}, ${parB}, ${Math.min(alpha, 1)})`;
        ctx.fill();
      }

      // --- Layer 4: Update nodes and draw connections ---
      // Update node positions
      for (const node of state.nodes) {
        node.x += node.vx * speed;
        node.y += node.vy * speed;

        // Bounce off edges with padding
        if (node.x < 0.02 || node.x > 0.98) node.vx *= -1;
        if (node.y < 0.02 || node.y > 0.98) node.vy *= -1;

        // Clamp
        node.x = Math.max(0.02, Math.min(0.98, node.x));
        node.y = Math.max(0.02, Math.min(0.98, node.y));
      }

      // Draw connections between nearby nodes
      const connDist = config.connectionDistance;
      ctx.lineWidth = 0.5;

      for (let i = 0; i < state.nodes.length; i++) {
        for (let j = i + 1; j < state.nodes.length; j++) {
          const a = state.nodes[i];
          const b = state.nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connDist) {
            const alpha = (1 - dist / connDist) * 0.35 * config.glowIntensity * brightMult;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.strokeStyle = `rgba(${pr}, ${pg}, ${pb}, ${Math.min(alpha, 1)})`;
            ctx.stroke();
          }
        }
      }

      // --- Layer 5: Draw nodes with glow ---
      for (const node of state.nodes) {
        const nx = node.x * w;
        const ny = node.y * h;
        const pulse = 0.5 + 0.5 * Math.sin(time * node.pulseSpeed + node.pulsePhase);
        const glowAlpha = (node.isBright ? 0.8 : 0.45) * pulse * config.glowIntensity * brightMult;
        const nodeRadius = node.radius * (1 + pulse * 0.3);

        // Outer glow
        if (node.isBright) {
          const glowRadius = nodeRadius * 6;
          const glow = ctx.createRadialGradient(nx, ny, 0, nx, ny, glowRadius);
          glow.addColorStop(0, `rgba(${gr}, ${gg}, ${gb}, ${Math.min(glowAlpha * 0.5, 1)})`);
          glow.addColorStop(0.4, `rgba(${gr}, ${gg}, ${gb}, ${Math.min(glowAlpha * 0.15, 1)})`);
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.fillRect(nx - glowRadius, ny - glowRadius, glowRadius * 2, glowRadius * 2);
        }

        // Node core
        ctx.beginPath();
        ctx.arc(nx, ny, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${Math.min(glowAlpha, 1)})`;
        ctx.fill();

        // Bright center point
        ctx.beginPath();
        ctx.arc(nx, ny, nodeRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(glowAlpha * 0.7, 1)})`;
        ctx.fill();
      }

      // --- Layer 6: Subtle light ray from a bright node ---
      if (state.nodes.length > 0 && config.brightNodeCount > 0) {
        const brightNode = state.nodes[0];
        const bnx = brightNode.x * w;
        const bny = brightNode.y * h;
        const rayPulse = 0.3 + 0.7 * Math.abs(Math.sin(time * 0.003 + config.driftAngle));
        const rayAlpha = 0.03 * config.glowIntensity * rayPulse * brightMult;

        const rayGrad = ctx.createRadialGradient(bnx, bny, 0, bnx, bny, w * 0.5);
        rayGrad.addColorStop(0, `rgba(${gr}, ${gg}, ${gb}, ${Math.min(rayAlpha * 2, 0.15)})`);
        rayGrad.addColorStop(0.3, `rgba(${gr}, ${gg}, ${gb}, ${Math.min(rayAlpha, 0.08)})`);
        rayGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = rayGrad;
        ctx.fillRect(0, 0, w, h);
      }

      timeRef.current = time + 1;
      animRef.current = requestAnimationFrame(animate);
    }

    // Start animation
    animRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [config, initState]);

  return (
    <canvas
      ref={canvasRef}
      className="constellation-canvas"
      aria-hidden="true"
    />
  );
});

export default ConstellationCanvas;
