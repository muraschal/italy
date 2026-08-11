/**
 * Holt die realen Streckenverläufe für alle Etappen des Roadtrips und legt sie
 * als statisches JSON für die RouteMap-Komponente ab.
 *
 *   npm run fetch-routes
 *
 * Beide Quellen sind öffentliche OpenStreetMap-Dienste ohne API-Key:
 *   - Autoetappen  → OSRM-Demoserver (OSRM_BASE_URL)
 *   - Fusswege     → Valhalla-Demoserver (VALHALLA_BASE_URL)
 *
 * Wichtig: Der OSRM-Demoserver hostet ausschliesslich den Auto-Graphen und
 * ignoriert ein `foot`-Profil in der URL stillschweigend — Fusswege kämen dann
 * als Autorouten zurück (Einbahnen, ZTL-Schleifen). Darum Valhalla für `walk`.
 */

import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const OSRM_BASE = (process.env.OSRM_BASE_URL ?? "https://router.project-osrm.org").replace(/\/$/, "");
const VALHALLA_BASE = (process.env.VALHALLA_BASE_URL ?? "https://valhalla1.openstreetmap.de").replace(/\/$/, "");

interface Coord {
  lat: number;
  lng: number;
}

/** Koordinaten müssen mit `coordinates` in data/trip.ts übereinstimmen. */
const locations: Record<string, Coord> = {
  tiefenbrunnen: { lat: 47.3547, lng: 8.5556 },
  mergoscia: { lat: 46.2086286, lng: 8.844509 },
  ascona: { lat: 46.154, lng: 8.7705 },
  como: { lat: 45.8103, lng: 9.0832 },
  "sina-de-la-ville": { lat: 45.4659654, lng: 9.1923116 },
  "duomo-milano": { lat: 45.4641, lng: 9.1919 },
  navigli: { lat: 45.4506, lng: 9.174 },
  langosteria: { lat: 45.455637, lng: 9.1714915 },
  "relais-san-vigilio": { lat: 45.7090243, lng: 9.6512689 },
  "citta-alta": { lat: 45.7036, lng: 9.6627 },
  erlenbach: { lat: 47.3035307, lng: 8.5934753 },
};

/** `car` → OSRM-Profil `driving`, `walk` → OSRM-Profil `foot`. */
type Mode = "car" | "walk";

interface Segment {
  from: string;
  to: string;
  day: string;
  mode: Mode;
}

const segments: Segment[] = [
  // Do — nach der Rundfunk-Party über den Gotthard ins Verzascatal
  { from: "tiefenbrunnen", to: "mergoscia", day: "giorno-1", mode: "car" },
  // Fr — Mergoscia → Ascona (Seven7) → Como
  { from: "mergoscia", to: "ascona", day: "giorno-2", mode: "car" },
  { from: "ascona", to: "como", day: "giorno-2", mode: "car" },
  // Sa — Como → Milano, abends zu Fuss durchs Zentrum
  { from: "como", to: "sina-de-la-ville", day: "giorno-3", mode: "car" },
  { from: "sina-de-la-ville", to: "duomo-milano", day: "giorno-3", mode: "walk" },
  { from: "langosteria", to: "sina-de-la-ville", day: "giorno-3", mode: "walk" },
  // So — Milano → Bergamo, dann hoch in die Città Alta
  { from: "sina-de-la-ville", to: "relais-san-vigilio", day: "giorno-4", mode: "car" },
  { from: "citta-alta", to: "relais-san-vigilio", day: "giorno-4", mode: "walk" },
  // Mo — Rückfahrt nach Erlenbach
  { from: "relais-san-vigilio", to: "citta-alta", day: "giorno-5", mode: "walk" },
  { from: "relais-san-vigilio", to: "erlenbach", day: "giorno-5", mode: "car" },
];

/** OSRM liefert polyline mit Präzision 5, Valhalla mit Präzision 6. */
function decodePolyline(encoded: string, precision = 5): [number, number][] {
  const factor = Math.pow(10, precision);
  const points: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push([lat / factor, lng / factor]);
  }

  return points;
}

interface RouteResult {
  from: string;
  to: string;
  day: string;
  points: [number, number][];
  distanceMeters: number;
  durationMinutes: number;
}

/**
 * Douglas-Peucker: wirft Stützpunkte weg, die innerhalb der Toleranz auf der
 * Verbindungslinie ihrer Nachbarn liegen.
 *
 * Die Rohdaten der Router sind für Navigation gedacht, nicht für eine Übersichts-
 * karte: Eine 335-km-Etappe kam mit über 7000 Punkten zurück. Da die gesamte
 * Datei per Import im Client-Bundle landet, kostet jeder Punkt Ladezeit, ohne
 * bei den hier gezeigten Zoomstufen sichtbar zu sein.
 */
function simplify(points: [number, number][], toleranceDeg: number): [number, number][] {
  if (points.length <= 2) return points;

  /** Senkrechter Abstand von `p` zur Geraden `a`–`b`, in Grad. */
  const perpendicular = (p: [number, number], a: [number, number], b: [number, number]) => {
    const [py, px] = p;
    const [ay, ax] = a;
    const [by, bx] = b;
    const dy = by - ay;
    const dx = bx - ax;
    if (dy === 0 && dx === 0) return Math.hypot(py - ay, px - ax);
    // Längengrade schrumpfen mit der Breite — sonst wird in Nord-Süd-Richtung zu grob vereinfacht.
    const k = Math.cos((ay * Math.PI) / 180);
    return Math.abs(dy * (ax - px) * k - (ay - py) * dx * k) / Math.hypot(dy, dx * k);
  };

  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;

  const stack: [number, number][] = [[0, points.length - 1]];
  while (stack.length > 0) {
    const [first, last] = stack.pop()!;
    let maxDist = 0;
    let index = -1;
    for (let i = first + 1; i < last; i++) {
      const d = perpendicular(points[i], points[first], points[last]);
      if (d > maxDist) {
        maxDist = d;
        index = i;
      }
    }
    if (index !== -1 && maxDist > toleranceDeg) {
      keep[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }

  return points.filter((_, i) => keep[i] === 1);
}

/**
 * Toleranz je Modus. Autoetappen werden über ganze Regionen gezeigt, Fusswege
 * im Strassenraster — dort muss feiner aufgelöst bleiben.
 * 0.00025° entsprechen rund 28 m, 0.00002° rund 2 m.
 */
const TOLERANCE: Record<Mode, number> = { car: 0.00025, walk: 0.00002 };

/** Autoetappe über OSRM. */
async function fetchCarRoute(origin: Coord, dest: Coord) {
  const coords = `${origin.lng},${origin.lat};${dest.lng},${dest.lat}`;
  const res = await fetch(`${OSRM_BASE}/route/v1/driving/${coords}?overview=full&geometries=polyline`);
  const data = await res.json();

  if (data.code !== "Ok" || !data.routes?.length) {
    throw new Error(`OSRM: ${data.code ?? res.status}`);
  }

  const route = data.routes[0];
  return {
    points: decodePolyline(route.geometry, 5),
    distanceMeters: Math.round(route.distance),
    durationMinutes: Math.round(route.duration / 60),
  };
}

/** Fussweg über Valhalla (`pedestrian`-Costing, shape als polyline6). */
async function fetchWalkRoute(origin: Coord, dest: Coord) {
  const res = await fetch(`${VALHALLA_BASE}/route`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      locations: [
        { lat: origin.lat, lon: origin.lng },
        { lat: dest.lat, lon: dest.lng },
      ],
      costing: "pedestrian",
      directions_options: { units: "kilometers" },
    }),
  });
  const data = await res.json();
  const leg = data.trip?.legs?.[0];

  if (!leg?.shape) {
    throw new Error(`Valhalla: ${data.error ?? res.status}`);
  }

  return {
    points: decodePolyline(leg.shape, 6),
    distanceMeters: Math.round(data.trip.summary.length * 1000),
    durationMinutes: Math.round(data.trip.summary.time / 60),
  };
}

async function fetchRoute(segment: Segment): Promise<RouteResult | null> {
  const origin = locations[segment.from];
  const dest = locations[segment.to];

  if (!origin || !dest) {
    console.error(`Unbekannte Location: ${segment.from} oder ${segment.to}`);
    return null;
  }

  try {
    const route =
      segment.mode === "car"
        ? await fetchCarRoute(origin, dest)
        : await fetchWalkRoute(origin, dest);

    return {
      from: segment.from,
      to: segment.to,
      day: segment.day,
      ...route,
      points: simplify(route.points, TOLERANCE[segment.mode]),
    };
  } catch (err) {
    console.error(`\n    Fehler für ${segment.from} → ${segment.to}:`, err);
    return null;
  }
}

async function main() {
  console.log(`Hole ${segments.length} Etappen (Auto: ${OSRM_BASE}, Fuss: ${VALHALLA_BASE}) ...\n`);

  let totalPoints = 0;
  const walking: RouteResult[] = [];
  const driving: RouteResult[] = [];

  for (const segment of segments) {
    process.stdout.write(`  [${segment.mode}] ${segment.from} → ${segment.to} ... `);

    const result = await fetchRoute(segment);
    if (result) {
      (segment.mode === "car" ? driving : walking).push(result);
      const km = (result.distanceMeters / 1000).toFixed(1);
      console.log(`✓ ${result.points.length} Punkte, ${km} km, ${result.durationMinutes} min`);
      totalPoints += result.points.length;
    } else {
      console.log("✗ fehlgeschlagen");
    }

    await new Promise((r) => setTimeout(r, 400));
  }

  const fs = await import("fs");
  const path = await import("path");
  const write = (file: string, data: RouteResult[]) => {
    fs.writeFileSync(path.join(process.cwd(), "data", file), JSON.stringify(data, null, 2));
    console.log(`✓ ${data.length} Etappen → data/${file}`);
  };

  console.log("");
  write("walking-routes.json", walking);
  write("car-routes.json", driving);
  console.log(`
${totalPoints} Stützpunkte nach Vereinfachung.`);
}

main();
