import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';
import ShimmerButton from './ShimmerButton';
import FlickeringGrid from './FlickeringGrid';

/**
 * StickyCard002 — GSAP ScrollTrigger Stacked Card Showcase
 * With Universal ShimmerButtons and animated FlickeringGrid background.
 */
export default function StickyCard002({ cards = [], className = '' }) {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cardElements = cardRefs.current.filter(Boolean);
    const totalCards = cardElements.length;

    if (totalCards === 0) return;

    // Initial state: Card 0 active, all subsequent cards below the fold
    gsap.set(cardElements[0], { y: '0%', scale: 1, rotation: 0, opacity: 1 });

    for (let i = 1; i < totalCards; i++) {
      gsap.set(cardElements[i], { y: '105%', scale: 0.95, rotation: 0, opacity: 0.9 });
    }

    const ctx = gsap.context(() => {
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top+=60',
          end: `+=${window.innerHeight * (totalCards - 0.5)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentCard = cardElements[i];
        const nextCard = cardElements[i + 1];
        const position = i;

        // Current card scales down, rotates slightly and fades cleanly
        scrollTimeline.to(
          currentCard,
          {
            scale: 0.88,
            rotation: i % 2 === 0 ? 3 : -3,
            y: '-4%',
            opacity: 0.45,
            duration: 1,
            ease: 'none',
          },
          position
        );

        // Next card slides up to cover current card
        scrollTimeline.to(
          nextCard,
          {
            y: '0%',
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 1,
            ease: 'none',
          },
          position
        );
      }
    }, containerRef);

    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [cards]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden z-20 ${className}`}
    >
      {/* Animated Flickering Grid Canvas Backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <FlickeringGrid
          squareSize={3}
          gridGap={22}
          flickerChance={0.22}
          color="rgb(255, 78, 50)"
          maxOpacity={0.35}
          className="absolute inset-0"
        />
        {/* Subtle Pitch Center Circle Blueprint */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/[0.06] border-dashed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-white/[0.08]" />
      </div>

      {/* Card Deck Container */}
      <div className="relative z-10 w-full max-w-5xl h-[520px] sm:h-[560px] md:h-[580px] flex items-center justify-center">
        {cards.map((card, i) => {
          const Icon = card.icon;
          const accent = card.accentColor || '#FF3C00';
          return (
            <div
              key={card.id || i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute inset-0 w-full h-full rounded-3xl bg-[#090D14] border border-white/[0.1] border-t-white/[0.22] shadow-[0_25px_70px_rgba(0,0,0,0.95)] p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-hidden will-change-transform"
            >
              {/* Card Top Header */}
              <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center border shadow-sm"
                    style={{
                      backgroundColor: `${accent}15`,
                      borderColor: `${accent}40`,
                      color: accent,
                    }}
                  >
                    {Icon ? <Icon className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  </div>
                  <div>
                    <span
                      className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase block"
                      style={{ color: accent }}
                    >
                      {card.badge || 'ELEVEN ENGINE'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black italic tracking-tight text-white">
                      {card.title}
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-white/40 tracking-wider">
                  0{i + 1} / 0{cards.length}
                </span>
              </div>

              {/* Card Main Body Grid */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-center">
                {/* Left Text / Info */}
                <div className="lg:col-span-6 space-y-3">
                  <p className="text-sm sm:text-base font-semibold text-white/95 leading-snug">
                    {card.tagline}
                  </p>
                  <p className="text-xs sm:text-sm font-mono text-[#94A3B8] leading-relaxed">
                    {card.description}
                  </p>

                  {/* Feature Telemetry Pills */}
                  {card.pills && card.pills.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {card.pills.map((pill, pIdx) => (
                        <span
                          key={pIdx}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-white/[0.04] border border-white/[0.08] text-white/80"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Interactive Mockup / Visual Graphic */}
                <div className="lg:col-span-6 h-full flex items-center justify-center">
                  {card.visual}
                </div>
              </div>

              {/* Card Footer Action CTA with ShimmerButton */}
              <div className="relative z-10 flex items-center justify-between border-t border-white/[0.08] pt-4">
                <span className="text-[11px] font-mono text-white/40 tracking-wider">
                  OPTA-GRADE UNCLASSIFIED PIPELINE
                </span>

                <ShimmerButton
                  to={card.link || '/explorer'}
                  shimmerColor={accent}
                  shimmerDuration="2.5s"
                  background="rgba(15, 20, 30, 0.9)"
                  className="px-5 py-2 text-xs"
                >
                  <span>{card.linkText || 'Launch Engine'}</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 ml-1 inline-block"
                    style={{ color: accent }}
                  />
                </ShimmerButton>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
