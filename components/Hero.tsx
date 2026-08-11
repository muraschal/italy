"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ItalyHeroFact from "./ItalyHeroFact";
import { TRIP_START_ISO } from "@/data/trip";
import imageManifest from "@/data/image-manifest.json";

const TARGET = new Date(TRIP_START_ISO).getTime();

/**
 * Alle Galeriebilder der Reise-Stationen, in der Reihenfolge des Manifests.
 * Reine Ortsbilder — der Wagen und die Party gehören woanders hin.
 */
const spots = imageManifest.spots as Record<string, string[]>;
const HERO_IMAGES = Object.values(spots).flat();

/** Wie lange ein Bild steht, bevor überblendet wird. */
const SLIDE_MS = 7000;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function randomIndex(max: number) {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0]! % max;
  }
  return Math.floor(Math.random() * max);
}

/** Nächstes Bild — zufällig, aber nie dasselbe zweimal hintereinander. */
function nextIndex(prev: number, len: number) {
  if (len <= 1) return 0;
  return (prev + 1 + randomIndex(len - 1)) % len;
}

/**
 * Zufällige Diashow hinter dem Titel.
 *
 * Startet bewusst deterministisch bei Bild 0, damit Server und Client dasselbe
 * rendern; gewürfelt wird erst ab dem ersten Intervall-Tick.
 */
function HeroSlideshow() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (HERO_IMAGES.length <= 1) return;
    const id = setInterval(() => setIdx((p) => nextIndex(p, HERO_IMAGES.length)), SLIDE_MS);
    return () => clearInterval(id);
  }, []);

  if (HERO_IMAGES.length === 0) return null;

  return (
    <>
      <AnimatePresence mode="sync">
        <motion.div
          key={idx}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.78 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        >
          <Image
            src={HERO_IMAGES[idx]!}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            priority={idx === 0}
            quality={82}
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      {/* Nur so viel Abdunklung wie der Text braucht — oben und unten stärker,
          in der Bildmitte fast nichts. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/10 to-ink/80 pointer-events-none" />
    </>
  );
}

export default function Hero() {
  const [diff, setDiff] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setDiff(Math.max(0, TARGET - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const d = diff ?? 0;
  const days = Math.floor(d / 86_400_000);
  const hours = Math.floor((d % 86_400_000) / 3_600_000);
  const minutes = Math.floor((d % 3_600_000) / 60_000);
  const seconds = Math.floor((d % 60_000) / 1000);
  const isPast = diff !== null && diff <= 0;

  return (
    <section className="relative h-[100svh] min-h-[100svh] w-full max-w-full overflow-hidden lg:h-dvh lg:min-h-0">
      {/* Background gradient — Nachthimmel über den Alpen */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a2b36] via-[#06181f] to-ink" />

      {/* Zufällige Diashow der Stationen, abgedunkelt damit der Text trägt */}
      <HeroSlideshow />

      {/* Die Diashow bringt ihren eigenen Verlauf mit — hier keine zweite
          Abdunklung mehr, sonst verschwinden die Bilder im Blau. */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_50%_30%,rgba(232,132,92,0.3)_0%,transparent_70%)]" />

      {/* Subtle star-like particles */}
      <div className="absolute inset-0 z-[6] overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] h-[1px] bg-white rounded-full animate-pulse-accent"
            style={{
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 23 + 7) % 80}%`,
              animationDelay: `${(i * 0.3) % 3}s`,
              opacity: 0.3 + (i % 3) * 0.2,
            }}
          />
        ))}
      </div>

      {/* Content — true center via absolute + transform */}
      <div
        className="absolute z-20 left-1/2 top-1/2 w-full max-w-lg px-6 text-center"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Italien in den Landesfarben — Quelle und Lizenz stehen im Footer. */}
          <Image
            src="/images/italy-flag-map.svg"
            alt="Umriss Italiens in den Landesfarben"
            width={737}
            height={870}
            priority
            className="mx-auto mb-5 h-16 w-auto drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)] sm:h-20"
          />

          <p className="text-text-secondary text-sm tracking-[0.3em] uppercase mb-4">
            13.–17. August 2026
          </p>

          <h1 className="text-[clamp(2.2rem,8vw,4.5rem)] font-light tracking-tight mb-3 leading-[1.1]">
            <span className="text-gradient-accent">Strada<br className="sm:hidden" /> del Sud</span>
          </h1>

          <p className="text-xl sm:text-2xl font-extralight text-text-primary/70 tracking-wide">
            Fünf Tage · Tessin, Como, Milano &amp; Bergamo
          </p>

          {/* Trikolore statt Flaggengrafik: läuft von Grün über die Kennzahl
              nach Rot durch — Italien-Zitat ohne fremdes Bildmaterial. */}
          <div className="flex items-center justify-center gap-3 mt-7 mb-8">
            <span
              aria-hidden
              className="h-[2px] w-14 sm:w-20 rounded-full bg-gradient-to-r from-transparent via-[#008C45] to-[#F4F5F0] opacity-80"
            />
            <span className="text-text-primary text-xs tracking-[0.2em] uppercase drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              731 km · 4 Nächte
            </span>
            <span
              aria-hidden
              className="h-[2px] w-14 sm:w-20 rounded-full bg-gradient-to-r from-[#F4F5F0] via-[#CD212A] to-transparent opacity-80"
            />
          </div>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: diff !== null ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {isPast ? (
            <p className="text-accent text-lg tracking-wide">Buon viaggio! 🥂</p>
          ) : (
            <div className="flex items-center justify-center gap-1 sm:gap-3">
              {[
                { value: pad(days), label: "Tage" },
                { value: pad(hours), label: "Std" },
                { value: pad(minutes), label: "Min" },
                { value: pad(seconds), label: "Sek" },
              ].map((unit, i) => (
                <div key={unit.label} className="flex items-center gap-1 sm:gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl sm:text-4xl font-extralight tracking-wider text-text-primary tabular-nums">
                      {unit.value}
                    </span>
                    <span className="text-[10px] text-text-muted tracking-[0.15em] uppercase mt-1">
                      {unit.label}
                    </span>
                  </div>
                  {i < 3 && (
                    <span className="text-accent-dim text-2xl font-extralight mb-4">:</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Reise-Fakt — ganz unten im Hero, über dem Scroll-Hinweis */}
      <div className="absolute z-20 bottom-[4.25rem] sm:bottom-20 left-1/2 w-full max-w-lg -translate-x-1/2 px-6 text-center pointer-events-none">
        <ItalyHeroFact />
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <ChevronDown className="w-5 h-5 text-accent opacity-40" />
      </motion.div>
    </section>
  );
}
