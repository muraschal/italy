"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const ROTATE_MS = 14_000;

function randInt(max: number) {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0]! % max;
  }
  return Math.floor(Math.random() * max);
}

function randRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function nextIndex(prev: number, len: number) {
  if (len <= 1) return 0;
  let n = prev;
  let guard = 0;
  while (n === prev && guard++ < 12) {
    n = randInt(len);
  }
  if (n === prev) n = (prev + 1 + randInt(len - 1)) % len;
  return n;
}

/**
 * Wort für Wort. Wird pro Fakt frisch gemountet (`key` an der Aufrufstelle) —
 * der Zähler startet dadurch von selbst bei 0 und braucht kein Reset im Effekt.
 */
function WordReveal({ text }: { text: string }) {
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (reduceMotion || words.length === 0) return;

    let wordIndex = 0;
    let timeoutId: number | undefined;

    const showNext = () => {
      wordIndex += 1;
      setVisible(wordIndex);
      if (wordIndex >= words.length) return;
      const ms = randRange(42, 95);
      timeoutId = window.setTimeout(showNext, ms);
    };

    const firstMs = randRange(120, 280);
    timeoutId = window.setTimeout(showNext, firstMs);

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [words.length, reduceMotion]);

  // Ohne Bewegung steht der Satz sofort vollständig da — abgeleitet statt im
  // Effekt gesetzt, sonst löst das eine Kaskade aus (react-hooks/set-state-in-effect).
  const shownCount = reduceMotion ? words.length : visible;
  const shown = words.slice(0, shownCount).join(" ");

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="inline-block w-full text-center text-[11px] sm:text-xs md:text-[13px] leading-snug md:leading-relaxed font-light italic text-white/90 tracking-[0.02em] text-balance [text-shadow:0_1px_16px_rgba(0,0,0,0.95),0_0_32px_rgba(0,0,0,0.65),0_0_1px_rgba(0,0,0,1)]"
    >
      {shown}
      {shownCount < words.length && (
        <span
          className="inline-block w-0.5 h-[0.85em] ml-0.5 align-[-0.1em] bg-white/90 animate-pulse rounded-sm"
          aria-hidden
        />
      )}
    </motion.span>
  );
}

export default function ItalyHeroFact() {
  const reduceMotion = useReducedMotion();
  const [facts, setFacts] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetch("/data/italy-facts.json")
      .then((res) => res.json())
      .then((data) => setFacts(data))
      .catch((err) => console.error("Failed to load italy facts:", err));
  }, []);

  useEffect(() => {
    if (reduceMotion || facts.length === 0) return;
    const id = window.setInterval(() => {
      setIdx((prev) => nextIndex(prev, facts.length));
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [facts.length, reduceMotion]);

  if (facts.length === 0) {
    return null;
  }

  return (
    /*
     * Kein `aria-live`: Der Fakt ist Dekoration, keine Statusmeldung. Als
     * Live-Region meldete jede der 14–23 Wortmutationen einzeln — alle 14 s ein
     * Schwall Ansagen, der die Warteschlange des Screenreaders füllte und die
     * eigene Navigation überdeckte. Die Region lag zudem seitenweit an, weil der
     * Hero beim Scrollen im DOM bleibt.
     */
    <div className="mx-auto w-full max-w-md min-h-[2.75rem] sm:min-h-[3rem] px-2 flex flex-col items-center justify-center gap-1.5">
      <p className="text-[10px] sm:text-[11px] text-accent/90 font-mono tabular-nums tracking-[0.12em] uppercase">
        Fakt {idx + 1} / {facts.length}
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35 }}
          className="w-full"
        >
          <WordReveal key={idx} text={facts[idx]!} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
