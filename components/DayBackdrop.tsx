"use client";

import { useSyncExternalStore } from "react";
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
/** Server rendert die zurückhaltende Variante; der Client korrigiert nach Breite. */
function useIsNarrow() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(max-width: 639px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(max-width: 639px)").matches,
    () => true
  );
}

export default function DayBackdrop({ activeDay }: { activeDay: number }) {
  const isNarrow = useIsNarrow();
  const key = DAY_KEYS[activeDay];
  const src = key ? DAY_IMAGES[key] : undefined;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <AnimatePresence mode="sync">
        {src && (
          <motion.div
            key={src}
            className="absolute inset-0"
            /* Mobil deutlich zurückhaltender: Dort füllt das Bild die ganze
               Spaltenbreite und würde die Karten sonst überstrahlen. */
            initial={{ opacity: 0 }}
            animate={{ opacity: isNarrow ? 0.22 : 0.45 }}
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
      {/* Oben stark abdunkeln, wo das Tagesprogramm steht — nach unten hin
          öffnen, damit das Bild im leeren Teil der Spalte zur Geltung kommt.
          Neutrales Schwarz statt Ink, sonst kippt alles ins Grüne. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/88 via-black/62 to-black/20" />
    </div>
  );
}
