"use client";

import { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import { frame, cancelFrame } from "framer-motion";

const LUXURY_EASING = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Lenis-Smooth-Scroll fürs ganze Dokument.
 *
 * Das frühere Scroll-Snapping (lenis/snap, Desktop, Sektionen als Snap-Punkte)
 * ist bewusst entfernt: Es übernahm mitten in einer Scrollbewegung die Kontrolle
 * und sprang zur nächsten Sektion. Wer das wieder will, muss auch lösen, dass
 * Snap-Punkte und die langen Agenda-/Timeline-Abschnitte sich beissen.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }
    frame.update(update, true);
    return () => cancelFrame(update);
  }, []);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.09,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        autoRaf: false,
        easing: LUXURY_EASING,
      }}
    >
      {children}
    </ReactLenis>
  );
}
