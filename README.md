# Strada del Sud

Reise-Website für den Roadtrip **Zürich → Tessin → Milano → Bergamo → Erlenbach**, 13.–17. August 2026.

Aufgebaut auf demselben Gerüst wie [paris.rapold.io](https://paris.rapold.io): Next.js App Router, Leaflet-Karte, Framer Motion, Lenis-Smooth-Scroll, Tailwind v4.

## Die Route

| Tag | Etappe | Übernachtung |
| --- | --- | --- |
| Do 13.8. | Rundfunk-Party, Tiefenbrunnen → Mergoscia | Mergoscia |
| Fr 14.8. | Mergoscia → Ascona (Seven7) → Como | Como |
| Sa 15.8. | Como → Milano · Rooftop-Pool, Duomo, Abend in der Stadt | Milano |
| So 16.8. | Milano → Bergamo · Funicolare in die Città Alta | Bergamo |
| Mo 17.8. | Città Alta, Rückfahrt nach Erlenbach | — |

Rund 731 km und gut 10 Stunden reine Fahrzeit.

## Entwicklung

```bash
npm install
npm run dev
```

Die Seite läuft auf [http://localhost:3000](http://localhost:3000).

## Deployment

Produktion läuft auf Vercel unter [italy.rapold.io](https://italy.rapold.io), gebaut über die Vercel-Git-Integration: Jeder Push auf `main` deployt nach Produktion, jeder Pull Request bekommt automatisch eine Preview-URL.

GitHub Actions deployt **nicht** — der Workflow in `.github/workflows/ci.yml` prüft nur, damit Fehler im PR sichtbar werden und nicht erst im Vercel-Build:

| Job | Prüft |
| --- | --- |
| `verify` | `tsc --noEmit`, `eslint`, `next build` |
| `routes` | Jede Etappe aus `trip.ts` hat einen Streckenverlauf in den Routen-JSONs |

Der zweite Job existiert, weil die Karte bei einem fehlenden Streckenverlauf stillschweigend eine gebogene Luftlinie zeichnet. Das sieht plausibel aus — `npm run check-routes` macht es laut.

## Daten pflegen

Der gesamte Reiseinhalt steckt in **`data/trip.ts`** — Orte, Tagesprogramm, Übernachtungen, Tickets und Budget. Die Komponenten leiten alles davon ab; Tagesanzahl und Farben kommen aus `lib/constants.ts` und müssen zur Länge von `days` passen.

### Streckenverläufe neu holen

Die Linien auf der Karte liegen als statisches JSON in `data/car-routes.json` und `data/walking-routes.json`. Wenn sich Orte oder Etappen ändern:

1. Koordinaten und Segmente in `scripts/fetch-routes.ts` anpassen
2. `npm run fetch-routes`

Das Skript nutzt zwei öffentliche OpenStreetMap-Dienste ohne API-Key: **OSRM** für Autoetappen und **Valhalla** für Fusswege. Beide lassen sich über `OSRM_BASE_URL` bzw. `VALHALLA_BASE_URL` auf eigene Instanzen umbiegen (siehe `.env.example`).

> Der OSRM-Demoserver hostet nur den Auto-Graphen und ignoriert ein `foot`-Profil stillschweigend — Fusswege kämen als Autorouten zurück. Deshalb läuft `walk` bewusst über Valhalla.

Schienenstrecken (Mailänder Metro, Funicolare Bergamo) sind von Hand in `data/metro-routes.json` gepflegt, inklusive Stationen und Linienfarben.

### Bilder

Bilder werden **allein durch Ablegen** eingebunden — kein Code-Eingriff. Der Dateiname bestimmt die Zuordnung, `<location-id>` ist die `id` aus `data/trip.ts`:

| Datei | Wirkung |
| --- | --- |
| `public/images/spots/<location-id>-1.jpg` | Hauptbild der Galerie beim Foto-Spot |
| `public/images/spots/<location-id>-2.jpg` | weiteres Bild desselben Spots (fortlaufend nummeriert) |
| `public/images/events/<location-id>.jpg` | Hintergrund des Programmpunkts in der Timeline |

Aktuelle IDs: `tiefenbrunnen`, `mergoscia`, `ascona`, `como`, `sina-de-la-ville`, `duomo-milano`, `galleria`, `navigli`, `relais-san-vigilio`, `citta-alta`, `erlenbach`.

Daraus erzeugt `scripts/generate-image-manifest.ts` die Datei `data/image-manifest.json`. Das läuft automatisch als `prebuild`, lässt sich aber auch direkt anstossen:

```bash
npm run images
```

Erlaubt sind `.jpg`, `.jpeg`, `.png`, `.webp` und `.avif`. Solange kein Bild vorliegt, rendern Galerie und Timeline sauber ohne — es entstehen keine toten Bildverweise.

### Fakten im Hero

Die rotierenden Fakten liegen als flaches String-Array in `public/data/italy-facts.json`. Die Anzeige zählt die Einträge selbst — Fakten lassen sich also einfach ergänzen oder streichen.

## Offen

- Unterkunft in Como suchen und buchen
- Reservation im Seven7 (Ascona)
- Buchung Sina De La Ville — aktuell favorisiert, noch nicht fix
- Buchungsreferenz Relais San Vigilio nachtragen
- Hotelgarage in Bergamo für den GTS reservieren
