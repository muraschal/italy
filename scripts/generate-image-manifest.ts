/**
 * Liest die abgelegten Bilder aus `public/images/` und schreibt daraus
 * `data/image-manifest.json`. Läuft automatisch vor jedem Build (`prebuild`),
 * lässt sich aber auch direkt anstossen:
 *
 *   npm run images
 *
 * Damit ein Foto auf der Seite erscheint, genügt es, die Datei nach der
 * Namenskonvention abzulegen — kein Code-Eingriff nötig:
 *
 *   public/images/spots/<location-id>-1.jpg    Galerie beim Foto-Spot
 *   public/images/spots/<location-id>-2.jpg    weitere Bilder desselben Spots
 *   public/images/events/<location-id>.jpg     Hintergrund im Tagesprogramm
 *
 * `<location-id>` ist die `id` aus `data/trip.ts`, also z. B. `mergoscia`,
 * `como` oder `navigli`.
 */

import { readdirSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const EXTENSIONS = /\.(jpe?g|png|webp|avif)$/i;

interface Manifest {
  /** location-id → Galerie, nach der Nummer im Dateinamen sortiert */
  spots: Record<string, string[]>;
  /** location-id → einzelnes Hintergrundbild */
  events: Record<string, string>;
}

function listImages(dir: string): string[] {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    return [];
  }
  return readdirSync(dir).filter((f) => EXTENSIONS.test(f));
}

function buildSpots(dir: string): Record<string, string[]> {
  const grouped = new Map<string, { order: number; file: string }[]>();

  for (const file of listImages(dir)) {
    const base = file.replace(EXTENSIONS, "");
    // `mergoscia-2` → id `mergoscia`, Reihenfolge 2. Ohne Suffix zählt das Bild als erstes.
    const match = base.match(/^(.*?)-(\d+)$/);
    const id = match ? match[1] : base;
    const order = match ? Number(match[2]) : 1;

    if (!grouped.has(id)) grouped.set(id, []);
    grouped.get(id)!.push({ order, file });
  }

  const out: Record<string, string[]> = {};
  for (const [id, entries] of [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    out[id] = entries
      .sort((a, b) => a.order - b.order || a.file.localeCompare(b.file))
      .map((e) => `/images/spots/${e.file}`);
  }
  return out;
}

function buildEvents(dir: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const file of listImages(dir).sort()) {
    const id = file.replace(EXTENSIONS, "");
    // Erste Datei pro id gewinnt — bei Dubletten wie `como.jpg` + `como.png`.
    if (!(id in out)) out[id] = `/images/events/${file}`;
  }
  return out;
}

const publicImages = join(process.cwd(), "public", "images");
const manifest: Manifest = {
  spots: buildSpots(join(publicImages, "spots")),
  events: buildEvents(join(publicImages, "events")),
};

const outPath = join(process.cwd(), "data", "image-manifest.json");
writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n");

const spotCount = Object.values(manifest.spots).reduce((s, g) => s + g.length, 0);
const eventCount = Object.keys(manifest.events).length;
console.log(
  `✓ data/image-manifest.json — ${spotCount} Spot-Bild(er) in ${Object.keys(manifest.spots).length} Galerie(n), ${eventCount} Event-Bild(er)`
);

const known = Object.keys(manifest.spots).concat(Object.keys(manifest.events));
if (known.length > 0) console.log(`  Zugeordnet: ${[...new Set(known)].join(", ")}`);
