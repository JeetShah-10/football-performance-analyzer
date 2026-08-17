import React from 'react';
import { AnimatedFooter } from './ui/animated-footer';

/**
 * Eleven Global Animated Footer
 * Featuring live ASCII art hands sampled from public/animated-footer/ images,
 * interactive cursor cluster highlights, parallax drift, and "Eleven" display typography.
 * Seamless, borderless transition from the European League Constellation.
 */
export default function Footer({
  leftImage = '/animated-footer/hand-left.jpg',
  rightImage = '/animated-footer/hand-right.jpg',
}) {
  return (
    <div className="relative h-[480px] sm:h-[580px] lg:h-[660px] w-full overflow-hidden bg-[#04070A] z-20">
      {/* Subtle, dull-to-duller top-centered ambient glow receiving light from the globe */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[360px] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(214,58,43,0.12)_0%,rgba(160,40,15,0.04)_45%,transparent_75%)] blur-[100px] pointer-events-none z-10" />

      <AnimatedFooter
        headingLines={['Eleven']}
        leftImage={leftImage}
        rightImage={rightImage}
        background="#04070A"
        textColor="#ffffff"
        charColor="#803500"
        hoverColor="#ff6a00"
        hoverCharColor="#0f0f0f"
        revealOnScroll={false}
      />
    </div>
  );
}
