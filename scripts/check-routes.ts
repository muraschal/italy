/**
 * Prüft, ob jede Auto- und Fussetappe aus data/trip.ts einen echten
 * Streckenverlauf in den Routen-JSONs hat.
 *
 *   npx tsx scripts/check-routes.ts
 *
 * Hintergrund: Findet die RouteMap zu einem Segment keinen Eintrag, zeichnet sie
 * stillschweigend eine gebogene Luftlinie. Das sieht plausibel aus und fällt
 * darum leicht durch — dieser Check macht es laut.
 */

import { days, getLocation, type Location } from "../data/trip";
import { DAY_KEYS } from "../lib/constants";
import carRoutes from "../data/car-routes.json";
import walkingRoutes from "../data/walking-routes.json";
import metroRoutes from "../data/metro-routes.json";

interface Segment {
  from: string;
  to: string;
  day: string;
  transport: string;
}

/** Spiegelt `getSegmentsForDay` aus components/RouteMap.tsx. */
function segmentsForDay(dayIndex: number): Segment[] {
  const out: Segment[] = [];
  let prev: Location | null = null;

  for (const evt of days[dayIndex].events) {
    if (!evt.locationId) continue;
    const loc = getLocation(evt.locationId);
    if (!loc) continue;

    if (prev && prev.id !== loc.id) {
      out.push({ from: prev.id, to: loc.id, day: DAY_KEYS[dayIndex], transport: evt.transport });
    }
    prev = loc;
  }
  return out;
}

const problems: string[] = [];

for (let d = 0; d < days.length; d++) {
  if (!DAY_KEYS[d]) {
    problems.push(`Tag ${d + 1} (${days[d].date}) hat keinen Eintrag in DAY_KEYS`);
    continue;
  }

  for (const seg of segmentsForDay(d)) {
    const where = `${DAY_KEYS[d]}: ${seg.from} → ${seg.to}`;
    const matches = (rows: { from: string; to: string; day: string }[]) =>
      rows.some((r) => r.from === seg.from && r.to === seg.to && r.day === seg.day);

    if (seg.transport === "car" && !matches(carRoutes)) {
      problems.push(`${where} — Autoetappe ohne Eintrag in car-routes.json`);
    }
    if (seg.transport === "walk" && !matches(walkingRoutes)) {
      problems.push(`${where} — Fussweg ohne Eintrag in walking-routes.json`);
    }
    if (seg.transport === "metro" && !matches(metroRoutes)) {
      problems.push(`${where} — Bahnetappe ohne Eintrag in metro-routes.json`);
    }
  }
}

// Länge der Farbpaletten muss zur Tagesanzahl passen, sonst greift der Fallback
// auf Palette 0 und zwei Tage sehen identisch aus.
if (DAY_KEYS.length !== days.length) {
  problems.push(`DAY_KEYS hat ${DAY_KEYS.length} Einträge, days aber ${days.length}`);
}

if (problems.length > 0) {
  console.error(`✗ ${problems.length} Problem(e):\n`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error("\nFehlen Streckenverläufe? → scripts/fetch-routes.ts ergänzen und `npm run fetch-routes` laufen lassen.");
  process.exit(1);
}

const total = days.reduce((s, _, d) => s + segmentsForDay(d).length, 0);
console.log(`✓ Alle ${total} Etappen über ${days.length} Tage haben einen Streckenverlauf.`);
