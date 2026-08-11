/**
 * Richtwerte für die Strecke Zürich → Tessin → Mailand → Bergamo — illustrativ,
 * keine Preisgarantie. Stand ca. 2025; CHF zu EUR grob mit 1.05 umgerechnet.
 */

export interface CityCoffeeRow {
  city: string;
  /** ISO-ähnlich für Mini-Label */
  flag: string;
  /** Durchschnitt ca. in EUR */
  eur: number;
}

/** Espresso an der Bar — die Währung dieser Reise. Höchster Balken = teuerster Ort. */
export const COFFEE_COMPARE: CityCoffeeRow[] = [
  { city: "Zürich", flag: "CH", eur: 4.6 },
  { city: "Locarno", flag: "CH", eur: 3.6 },
  { city: "Lugano", flag: "CH", eur: 3.4 },
  { city: "Como", flag: "IT", eur: 1.6 },
  { city: "Milano", flag: "IT", eur: 1.4 },
  { city: "Bergamo", flag: "IT", eur: 1.2 },
];

export interface FuelRow {
  country: string;
  flag: string;
  /** Benzin 95, ca. EUR pro Liter */
  eur: number;
}

/** Tanken auf der Route — in der Schweiz voll machen lohnt sich nicht immer. */
export const FUEL_COMPARE: FuelRow[] = [
  { country: "Schweiz", flag: "CH", eur: 1.85 },
  { country: "Italien", flag: "IT", eur: 1.82 },
  { country: "Frankreich", flag: "FR", eur: 1.78 },
  { country: "Deutschland", flag: "DE", eur: 1.75 },
  { country: "Österreich", flag: "AT", eur: 1.62 },
];

export interface TravelInsight {
  title: string;
  detail: string;
  /** lucide icon name subset */
  icon: "car" | "utensils" | "wallet" | "smartphone" | "receipt" | "fuel";
}

export const TRAVEL_INSIGHTS: TravelInsight[] = [
  {
    icon: "car",
    title: "ZTL & Area C",
    detail:
      "Mailands Zentrum ist kostenpflichtige Zone, Bergamos Città Alta weitgehend gesperrt. Kennzeichen übers Hotel anmelden — sonst kommt die Busse Wochen später per Post.",
  },
  {
    icon: "fuel",
    title: "Vignette & Maut",
    detail:
      "Schweizer Autobahnvignette 40 CHF fürs Jahr. In Italien wird auf der Autostrada pro Abschnitt bezahlt — Telepass-Spur nur mit Gerät, sonst blaue oder weisse Spur.",
  },
  {
    icon: "wallet",
    title: "Parkieren",
    detail:
      "Blaue Linien = kostenpflichtig, weisse = gratis, gelbe = reserviert. In Städten lohnt sich das Hotel- oder Parkhausticket gegenüber der Suche fast immer.",
  },
  {
    icon: "utensils",
    title: "Coperto & Aperitivo",
    detail:
      "Auf der Rechnung steht oft ein Coperto von 2–4 € pro Person — das ist normal, kein Trinkgeld. Zwischen 18 und 21 Uhr gibt es zum Aperitivo meist ein Buffet dazu.",
  },
  {
    icon: "smartphone",
    title: "Zahlen",
    detail:
      "Karte und Apple/Google Pay gehen praktisch überall, auch für Kleinstbeträge. Bargeld braucht es noch an Bergbahnen, kleinen Bars und auf Märkten.",
  },
  {
    icon: "receipt",
    title: "Espresso-Etikette",
    detail:
      "An der Bar stehend kostet der Kaffee oft die Hälfte vom Tischpreis — erst an der Kasse zahlen, dann mit dem Bon zum Barista. Cappuccino nur bis mittags.",
  },
];
