"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { DAY_KEYS } from "@/lib/constants";
import imageManifest from "@/data/image-manifest.json";

/** Hintergrundbild pro Reisetag — `public/images/days/<day-key>.jpg`. */
const DAY_IMAGES = imageManifest.days as Record<string, string | undefined>;

/**
 * Füllt die Tagesspalte hinter dem Programm. Bewusst als eigene Ebene über dem
 * Panel statt im Timeline-Inhalt: Nur so reicht das Bild über die volle Höhe der
 * Spalte und nicht bloss über die Höhe der Programmpunkte.
 *
 * Ohne passende Datei rendert die Komponente nichts — kein toter Bildverweis.
 */
export default function DayBackdrop({ activeDay }: { activeDay: number }) {
  const key = DAY_KEYS[activeDay];
  const src = key ? DAY_IMAGES[key] : undefined;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <AnimatePresence mode="sync">
        {src && (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.16 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              quality={72}
              className="object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/35 to-ink/85" />
    </div>
  );
}
