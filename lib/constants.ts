/** Shared constants used across multiple components. */

/** Per-day accent colours — index 0…4 = Reisetage, 5 = ALL. */
export const DAY_COLORS = ["#c9a96e", "#7eb8e0", "#e0a07e", "#8fbf9f", "#d69fb0", "#a89fbf"] as const;

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
  ["#FFD700", "#FF8C00", "#22D3EE", "#FF6B6B", "#4ADE80"],
  // Fr — Mergoscia → Ascona → Morcote
  ["#38BDF8", "#FACC15", "#F472B6", "#34D399", "#C084FC"],
  // Sa — Morcote → Milano
  ["#FB7185", "#2DD4BF", "#FCD34D", "#A78BFA", "#38BDF8"],
  // So — Milano → Bergamo
  ["#4ADE80", "#F97316", "#60A5FA", "#F472B6", "#FDE047"],
  // Mo — Bergamo → Erlenbach
  ["#C084FC", "#FBBF24", "#2DD4BF", "#FB7185", "#93C5FD"],
];

/** Colour used when a map marker or timeline segment is hovered. */
export const HOVER_COLOR = "#FF2D78";

/** Accent colour for the combined "ALL days" map view. */
export const ALL_MAP_ACCENT = "#c9a96e";
