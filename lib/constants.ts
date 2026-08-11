/**
 * Shared constants used across multiple components.
 *
 * Farbwelt „Lago di Como bei Nacht“ — die Basistöne stehen in app/globals.css,
 * hier liegen nur die Werte, die JavaScript zur Laufzeit braucht (Leaflet-Polylines,
 * Inline-Styles). Beide Stellen zusammen halten.
 */

/** Per-day accent colours — index 0…4 = Reisetage, 5 = ALL. */
export const DAY_COLORS = [
  "#f2b544", // Do — Amber, Scheinwerfer in der Nacht
  "#46c4bb", // Fr — Aqua, Tessiner Seen
  "#e8845c", // Sa — Terracotta, Milano
  "#8ac36a", // So — Olive, Bergamasker Hügel
  "#6fa8dc", // Mo — Himmelblau, Heimfahrt
  "#e6d5b8", // ALL — warmer Kalkstein
] as const;

/** Day keys used for route-JSON look-ups. */
export const DAY_KEYS = ["giorno-1", "giorno-2", "giorno-3", "giorno-4", "giorno-5"] as const;

/** Italian day labels shown in tabs. */
export const DAY_LABELS = [
  "Giovedì",
  "Venerdì",
  "Sabato",
  "Domenica",
  "Lunedì",
  "TUTTI",
] as const;

/** German day labels (used in ticket badges & map bounds). */
export const DAY_LABELS_DE = [
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
  "Montag",
] as const;

/**
 * Alternating warm/cool palettes for route segments so that neighbours always
 * contrast.  One sub-array per trip day.
 */
export const STAGE_PALETTES: readonly string[][] = [
  // Do — Tiefenbrunnen → Mergoscia
  ["#F2B544", "#E8845C", "#46C4BB", "#F4E285", "#8AC36A"],
  // Fr — Mergoscia → Ascona → Como
  ["#46C4BB", "#F2B544", "#EF7B8E", "#8AC36A", "#6FA8DC"],
  // Sa — Como → Milano
  ["#E8845C", "#46C4BB", "#F2C94C", "#B084E0", "#6FA8DC"],
  // So — Milano → Bergamo
  ["#8AC36A", "#E8845C", "#6FA8DC", "#EF7B8E", "#F2C94C"],
  // Mo — Bergamo → Erlenbach
  ["#6FA8DC", "#F2B544", "#46C4BB", "#E8845C", "#B084E0"],
];

/** Colour used when a map marker or timeline segment is hovered. */
export const HOVER_COLOR = "#FF5D8F";

/** Accent colour for the combined "ALL days" map view. */
export const ALL_MAP_ACCENT = "#e8845c";

/**
 * Feste Farben pro Verkehrsmittel — müssen sich von allen STAGE_PALETTES
 * abheben, damit Auto- und Bahnetappen auf der Karte lesbar bleiben.
 */
export const TRANSPORT_COLORS = {
  car: "#b084e0",
  metro: "#3aa8c4",
} as const;
