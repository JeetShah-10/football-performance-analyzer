import React, { useEffect, useRef } from 'react';

/**
 * ParticleSphere — GPU/CPU-Optimized 3D Rotating Particle Globe Canvas
 * Engineered for 60fps performance across low-end and high-end hardware.
 * Auto-pauses when off-screen via IntersectionObserver.
 */
export default function ParticleSphere({
  count = 260,
  radius = 145,
  color = '#FF4E32',
  accentColor = '#FFB800',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId = null;
    let isVisible = true;
    let rotationY = 0;
    const rotationX = 0.22;

    // Fibonacci Sphere distribution
    const particles = [];
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      particles.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        baseSize: Math.random() * 1.2 + 1.0,
        isAccent: Math.random() < 0.22,
      });
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const width = canvas.parentElement?.clientWidth || 320;
      const height = canvas.parentElement?.clientHeight || 320;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // IntersectionObserver to sleep rendering when scrolled away
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          render();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const render = () => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      rotationY += 0.004;

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const fov = 420 * dpr;

      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        const y1 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        const scale = fov / (fov + z2);
        const x2 = x1 * scale + centerX;
        const y2 = y1 * scale + centerY;

        const alpha = Math.max(0.12, (z2 + radius) / (2 * radius));

        projected.push({
          x: x2,
          y: y2,
          z: z2,
          scale,
          alpha,
          size: p.baseSize * scale * dpr,
          isAccent: p.isAccent,
        });
      }

      projected.sort((a, b) => a.z - b.z);

      for (let i = 0; i < projected.length; i++) {
        const pt = projected[i];
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = pt.isAccent
          ? `rgba(255, 184, 0, ${pt.alpha * 0.95})`
          : `rgba(255, 78, 50, ${pt.alpha * 0.8})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, [count, radius, color, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      className="size-full block pointer-events-none select-none"
    />
  );
}
