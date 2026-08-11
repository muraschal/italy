export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  googleMapsUrl: string;
  category: "hotel" | "restaurant" | "landmark" | "bar" | "cafe" | "entertainment" | "shopping" | "transport";
  photoSpot?: boolean;
  instagramUrl?: string;
  photoTip?: string;
  photoGallery?: string[];
  hidden?: boolean;
}

export interface TicketInfo {
  title: string;
  day: string;
  datetime: string;
  refs: { label: string; value: string }[];
  notes: string[];
  cancellation?: string;
  /** Erst `true`, wenn eine verbindliche Buchung vorliegt — steuert das Badge im TicketVault. */
  confirmed: boolean;
}

export interface TripEvent {
  time: string;
  endTime?: string;
  title: string;
  description?: string;
  locationId: string | null;
  /** `metro` deckt schienengebundene Kurzstrecken ab — hier die Funicolare in Bergamo. */
  transport: "walk" | "car" | "metro" | "none";
  transportDuration?: string;
  cost: number | null;
  costNote?: string;
  costPaid?: boolean;
  highlight: boolean;
  ticketRef?: string;
  icon: string;
  note?: string;
  funFact?: string;
}

export interface TripDay {
  date: string;
  label: string;
  subtitle: string;
  events: TripEvent[];
  totalCost: number;
}

export interface BudgetItem {
  label: string;
  amount: number;
  icon: string;
}

/** Start der Reise — Abfahrt in Tiefenbrunnen nach der Rundfunk-Party. */
export const TRIP_START_ISO = "2026-08-13T23:00:00+02:00";

export const locations: Location[] = [
  {
    id: "tiefenbrunnen",
    name: "Zürich Tiefenbrunnen",
    address: "Tiefenbrunnen, 8008 Zürich",
    coordinates: { lat: 47.3547, lng: 8.5556 },
    googleMapsUrl: "https://maps.google.com/?q=Z%C3%BCrich+Tiefenbrunnen",
    category: "transport",
  },
  {
    id: "mergoscia",
    name: "Mergoscia",
    address: "6647 Mergoscia, Tessin",
    coordinates: { lat: 46.2086286, lng: 8.844509 },
    googleMapsUrl: "https://maps.google.com/?q=Mergoscia+6647",
    category: "landmark",
    photoSpot: true,
    instagramUrl: "https://www.instagram.com/explore/tags/mergoscia/",
    photoTip:
      "Terrassendorf hoch über dem Verzascatal — der Blick geht über den Lago di Vogorno bis zum Lago Maggiore. Bestes Licht am späten Nachmittag.",
  },
  {
    id: "ascona",
    name: "Seven7 · Ascona",
    address: "Piazza G. Motta, 6612 Ascona",
    coordinates: { lat: 46.154, lng: 8.7705 },
    googleMapsUrl: "https://maps.google.com/?q=Seven+Ascona+Piazza+Motta",
    category: "restaurant",
    photoSpot: true,
    instagramUrl: "https://www.instagram.com/explore/tags/ascona/",
    photoTip:
      "Die Piazza Motta zur Goldenen Stunde — Seepromenade im Gegenlicht, Palmen und Pastellfassaden im Rücken.",
  },
  {
    id: "como",
    name: "Como",
    address: "22100 Como, Lombardei",
    coordinates: { lat: 45.8103, lng: 9.0832 },
    googleMapsUrl: "https://maps.google.com/?q=Como+Lago+di+Como",
    category: "landmark",
    photoSpot: true,
    instagramUrl: "https://www.instagram.com/explore/tags/lagodicomo/",
    photoTip:
      "Von der Seepromenade an der Piazza Cavour über das Wasser — oder mit der Funicolare nach Brunate hoch und die ganze Seegabel von oben.",
  },
  {
    id: "sina-de-la-ville",
    name: "Sina De La Ville",
    address: "Via Ulrico Hoepli 6, 20121 Milano",
    coordinates: { lat: 45.4659654, lng: 9.1923116 },
    googleMapsUrl: "https://maps.google.com/?q=Via+Ulrico+Hoepli+6+20121+Milano",
    category: "hotel",
  },
  {
    id: "duomo-milano",
    name: "Duomo di Milano",
    address: "Piazza del Duomo, 20122 Milano",
    coordinates: { lat: 45.4641, lng: 9.1919 },
    googleMapsUrl: "https://maps.google.com/?q=Duomo+di+Milano",
    category: "landmark",
    photoSpot: true,
    instagramUrl: "https://www.instagram.com/explore/tags/duomodimilano/",
    photoTip:
      "Auf die Dachterrassen hinauf — zwischen den Fialen hindurch fotografieren. Früh am Morgen ist die Piazza noch leer.",
  },
  {
    id: "navigli",
    name: "Navigli",
    address: "Naviglio Grande, 20144 Milano",
    coordinates: { lat: 45.4506, lng: 9.174 },
    googleMapsUrl: "https://maps.google.com/?q=Naviglio+Grande+Milano",
    category: "bar",
    photoSpot: true,
    instagramUrl: "https://www.instagram.com/explore/tags/navigli/",
    photoTip:
      "Zur blauen Stunde vom Ufer aus — die Lichterketten der Bars spiegeln sich im Kanal.",
  },
  {
    id: "relais-san-vigilio",
    name: "Relais San Vigilio al Castello",
    address: "Via al Castello 7, 24129 Bergamo",
    coordinates: { lat: 45.7090243, lng: 9.6512689 },
    googleMapsUrl: "https://maps.google.com/?q=Via+al+Castello+7+24129+Bergamo",
    category: "hotel",
  },
  {
    id: "citta-alta",
    name: "Città Alta · Piazza Vecchia",
    address: "Piazza Vecchia, 24129 Bergamo",
    coordinates: { lat: 45.7036, lng: 9.6627 },
    googleMapsUrl: "https://maps.google.com/?q=Piazza+Vecchia+Bergamo",
    category: "landmark",
    photoSpot: true,
    instagramUrl: "https://www.instagram.com/explore/tags/cittaalta/",
    photoTip:
      "Von der Piazza aus durch die Arkaden des Palazzo della Ragione auf den Campanone — abends warm ausgeleuchtet.",
  },
  {
    id: "erlenbach",
    name: "Erlenbach ZH",
    address: "Weinbergstrasse 5, 8703 Erlenbach",
    coordinates: { lat: 47.3035307, lng: 8.5934753 },
    googleMapsUrl: "https://maps.google.com/?q=Weinbergstrasse+5+8703+Erlenbach",
    category: "transport",
  },
];

export const days: TripDay[] = [
  {
    date: "2026-08-13",
    label: "Giovedì",
    subtitle: "La Partenza — nach der Rundfunk-Party über den Gotthard ins Verzascatal",
    totalCost: 43,
    events: [
      {
        time: "~21:00",
        title: "Rundfunk Party",
        description: "Letzter Abend daheim · der GTS steht gepackt und abfahrbereit in Tiefenbrunnen",
        locationId: "tiefenbrunnen",
        transport: "none",
        cost: null,
        highlight: true,
        icon: "music",
        funFact:
          "Gepackt parkieren, dann feiern: Wer nach der Party nur noch einsteigen muss, spart sich die Diskussion, ob man wirklich noch losfährt.",
      },
      {
        time: "~23:00",
        title: "Abfahrt Richtung Süden",
        description: "Tiefenbrunnen raus, A2 rein — nachts durch den Gotthard ohne Stau",
        locationId: "tiefenbrunnen",
        transport: "none",
        cost: 43,
        costNote: "Autobahnvignette Schweiz (40 CHF)",
        highlight: false,
        icon: "car",
        funFact:
          "Der Gotthard-Strassentunnel ist 16,9 km lang. Tagsüber im August steht man vor dem Nordportal schnell zwei Stunden — nachts fährt man durch.",
      },
      {
        time: "~02:00",
        title: "Ankunft Mergoscia",
        description: "Terrassendorf über dem Lago di Vogorno · erste Übernachtung",
        locationId: "mergoscia",
        transport: "car",
        transportDuration: "~2 Std 50 · 203 km",
        cost: null,
        highlight: true,
        icon: "hotel",
        funFact:
          "Die letzten Kilometer nach Mergoscia hinauf sind eng, kurvig und schlecht beleuchtet — im Dunkeln ruhig angehen lassen.",
      },
    ],
  },
  {
    date: "2026-08-14",
    label: "Venerdì",
    subtitle: "Verso il lago — Vormittag in Mergoscia, Pizza in Ascona, Abend in Como",
    totalCost: 140,
    events: [
      {
        time: "~10:00",
        title: "Vormittag in Mergoscia",
        description: "Ausschlafen, Kaffee auf der Terrasse, Blick über das Verzascatal",
        locationId: "mergoscia",
        transport: "none",
        cost: null,
        highlight: false,
        icon: "coffee",
        funFact:
          "Das Wasser der Verzasca ist so klar, dass man den Grund auf mehreren Metern Tiefe sieht. Die Staumauer im Tal ist die Bungee-Sprungstelle aus dem «GoldenEye»-Intro.",
      },
      {
        time: "~16:00",
        title: "Ascona — Piazza Motta",
        description: "Runter an den Lago Maggiore · Seepromenade, Palmen, Pastellfassaden",
        locationId: "ascona",
        transport: "car",
        transportDuration: "~20 Min · 13 km",
        cost: null,
        highlight: false,
        icon: "mountain",
        funFact:
          "Ascona liegt auf 196 m — der tiefstgelegene Ort der Schweiz. Die Piazza Motta ist autofrei und geht direkt in die Seepromenade über.",
      },
      {
        time: "~18:00",
        title: "Seven7 — Pizza & Drinks",
        description: "Der Freitagabend-Stopp direkt an der Piazza",
        locationId: "ascona",
        transport: "none",
        cost: 140,
        costNote: "Pizza & Drinks für 2",
        highlight: true,
        icon: "utensils",
        ticketRef: "seven7",
      },
      {
        time: "~21:00",
        title: "Weiter nach Como",
        description: "Über den Monte Ceneri und Lugano an den Lago di Como · Übernachtung in Como",
        locationId: "como",
        transport: "car",
        transportDuration: "~1 Std 10 · 73 km",
        cost: null,
        highlight: true,
        icon: "hotel",
        ticketRef: "como",
        funFact:
          "Como lebte jahrhundertelang von der Seide und webt bis heute einen Grossteil der europäischen Krawatten- und Tuchseide — die Fabriken liegen unscheinbar am Stadtrand.",
      },
    ],
  },
  {
    date: "2026-08-15",
    label: "Sabato",
    subtitle: "Milano — Rooftop-Pool, Duomo und der Abend in der Stadt",
    totalCost: 320,
    events: [
      {
        time: "~10:00",
        title: "Entspannter Vormittag in Como",
        description: "Frühstück am See, Seepromenade, Altstadt — keine Eile",
        locationId: "como",
        transport: "none",
        cost: null,
        highlight: false,
        icon: "coffee",
        funFact:
          "Die Funicolare von Como nach Brunate fährt seit 1894 und überwindet auf gut anderthalb Kilometern rund 500 Höhenmeter — oben liegt der Blick über die ganze Seegabel.",
      },
      {
        time: "~14:00",
        title: "Check-in Sina De La Ville",
        description: "Via Ulrico Hoepli 6 · zwei Gehminuten hinter der Scala · Rooftop-Pool",
        locationId: "sina-de-la-ville",
        transport: "car",
        transportDuration: "~50 Min · 52 km",
        cost: null,
        costPaid: true,
        highlight: true,
        icon: "hotel",
        ticketRef: "sina-de-la-ville",
        funFact:
          "Mailands Zentrum ist Area C — eine kostenpflichtige Verkehrszone. Ein- und Ausfahrt vorab über das Hotel anmelden, sonst kommt die Busse per Post in die Schweiz.",
      },
      {
        time: "~15:30",
        title: "Rooftop-Pool",
        description: "Über den Dächern von Mailand · Duomo in Sichtweite",
        locationId: "sina-de-la-ville",
        transport: "none",
        cost: null,
        costNote: "Inklusiv",
        costPaid: true,
        highlight: true,
        icon: "waves",
      },
      {
        time: "~18:00",
        title: "Duomo di Milano",
        description: "Kathedrale und Dachterrassen · zwischen 135 Fialen über der Stadt",
        locationId: "duomo-milano",
        transport: "walk",
        transportDuration: "6 Min · 400 m",
        cost: 40,
        costNote: "2× Dachterrassen-Ticket (Schätzung)",
        highlight: true,
        icon: "landmark",
        funFact:
          "Der Bau dauerte fast 600 Jahre. Bis 1960 durfte kein Gebäude Mailands die Madonnina auf der Spitze überragen — der Pirelli-Turm bekam deshalb eine eigene Kopie aufs Dach.",
      },
      {
        time: "~20:30",
        title: "Dinner & Milano am Abend",
        description: "Vorschlag: Aperitivo und Cena an den Navigli — Bar an Bar entlang des Kanals",
        locationId: "navigli",
        transport: "metro",
        transportDuration: "~15 Min",
        cost: 280,
        costNote: "Dinner & Drinks für 2",
        highlight: true,
        icon: "champagne",
        funFact:
          "Die Navigli sind ein Kanalsystem aus dem 12. Jahrhundert — über sie wurde der Marmor für den Duomo in die Stadt geschifft. Leonardo da Vinci hat an den Schleusen mitgebaut.",
      },
      {
        time: "~00:30",
        title: "Rückweg ins Hotel",
        description: "2,8 km zu Fuss durch die Altstadt — oder Taxi, je nach Abend",
        locationId: "sina-de-la-ville",
        transport: "walk",
        transportDuration: "~35 Min · 2,8 km",
        cost: null,
        highlight: false,
        icon: "sparkles",
      },
    ],
  },
  {
    date: "2026-08-16",
    label: "Domenica",
    subtitle: "Bergamo — hinauf nach San Vigilio und mit der Funicolare in die Città Alta",
    totalCost: 200,
    events: [
      {
        time: "~10:00",
        title: "Nochmals Milano",
        description: "Vormittag frei · Kaffee, Schaufenster, letzte Runde durchs Zentrum",
        locationId: "sina-de-la-ville",
        transport: "none",
        cost: 35,
        costNote: "Colazione & Kaffee",
        highlight: false,
        icon: "coffee",
        funFact:
          "Cappuccino nach 11 Uhr gilt als Stilbruch — ab Mittag trinkt man Espresso. An der Bar stehend kostet er oft die Hälfte vom Sitzplatzpreis.",
      },
      {
        time: "~14:00",
        title: "Check-in Relais San Vigilio al Castello",
        description: "Via al Castello 7 · GTS in die Hotelgarage, dann zu Fuss weiter",
        locationId: "relais-san-vigilio",
        transport: "car",
        transportDuration: "~55 Min · 55 km",
        cost: null,
        costPaid: true,
        highlight: true,
        icon: "hotel",
        ticketRef: "relais-san-vigilio",
        funFact:
          "San Vigilio ist der höchste Punkt Bergamos. Die Gassen dort oben sind eng und teilweise gesperrt — die Hotelgarage ist keine Bequemlichkeit, sondern Notwendigkeit.",
      },
      {
        time: "~16:30",
        title: "Funicolare & Città Alta",
        description: "Mit der Standseilbahn hinunter nach Colle Aperto, dann zu Fuss zur Piazza Vecchia",
        locationId: "citta-alta",
        transport: "metro",
        transportDuration: "~15 Min",
        cost: 10,
        costNote: "2× Funicolare",
        highlight: true,
        icon: "train",
        funFact:
          "Die Funicolare San Vigilio fährt seit 1912 und überwindet 90 Höhenmeter in vier Minuten. Le Corbusier nannte die Piazza Vecchia unten den schönsten Platz Europas.",
      },
      {
        time: "~20:00",
        title: "Cena in der Città Alta",
        description: "Bergamasker Küche · Casoncelli, Polenta, Valcalepio im Glas",
        locationId: "citta-alta",
        transport: "none",
        cost: 155,
        costNote: "Abendessen + Wein für 2",
        highlight: true,
        icon: "utensils",
        funFact:
          "Casoncelli sind gefüllte Teigtaschen mit Speck, Butter und Salbei — das Bergamasker Nationalgericht. Dazu passt ein Valcalepio Rosso aus den Hügeln vor der Stadt.",
      },
      {
        time: "~23:30",
        title: "Zurück nach San Vigilio",
        description: "Bergauf zu Fuss — die Funicolare fährt abends nicht mehr durchgehend",
        locationId: "relais-san-vigilio",
        transport: "walk",
        transportDuration: "~27 Min · 1,6 km",
        cost: null,
        highlight: false,
        icon: "sparkles",
      },
    ],
  },
  {
    date: "2026-08-17",
    label: "Lunedì",
    subtitle: "Il Ritorno — nochmals Città Alta, dann die lange Fahrt nach Hause",
    totalCost: 73,
    events: [
      {
        time: "~09:00",
        title: "Frühstück mit Aussicht",
        description: "Letzter Blick von San Vigilio über die Poebene",
        locationId: "relais-san-vigilio",
        transport: "none",
        cost: null,
        costNote: "im Zimmerpreis",
        costPaid: true,
        highlight: false,
        icon: "coffee",
      },
      {
        time: "~10:30",
        title: "Nochmals Città Alta",
        description: "Die venezianischen Mauern bei Tageslicht · Kaffee auf der Piazza",
        locationId: "citta-alta",
        transport: "walk",
        transportDuration: "~22 Min · 1,7 km",
        cost: 45,
        costNote: "Kaffee & Kleinigkeit",
        highlight: true,
        icon: "landmark",
        funFact:
          "Die venezianischen Stadtmauern rund um die Città Alta sind seit 2017 UNESCO-Welterbe — 6 km lang, nie belagert, nie geschleift.",
      },
      {
        time: "~13:00",
        title: "Abfahrt Bergamo",
        description: "GTS aus der Garage, Gepäck rein, Richtung Norden",
        locationId: "relais-san-vigilio",
        transport: "none",
        cost: null,
        highlight: false,
        icon: "car",
      },
      {
        time: "~17:30",
        title: "Ankunft Erlenbach",
        description: "335 km zurück über die Alpen · Ende der Reise",
        locationId: "erlenbach",
        transport: "car",
        transportDuration: "~4 Std 20 · 335 km",
        cost: 28,
        costNote: "Maut Autostrada",
        highlight: true,
        icon: "car",
        funFact:
          "Am Montagnachmittag ist die Gotthard-Nordrichtung meist frei — das Nadelöhr ist die Gegenrichtung am Freitag.",
      },
    ],
  },
];

export const tickets: Record<string, TicketInfo> = {
  seven7: {
    title: "Seven7 — Pizza & Drinks",
    day: "Freitag",
    datetime: "Fr 14. Aug · Abend",
    confirmed: false,
    refs: [],
    notes: [
      "Piazza G. Motta, 6612 Ascona",
      "TODO: reservieren — im August ist die Piazza voll",
    ],
  },
  como: {
    title: "Como — 1 Nacht",
    day: "Freitag",
    datetime: "Fr 14. Aug ~22:00 – Sa 15. Aug",
    confirmed: false,
    refs: [],
    notes: [
      "22100 Como, Lombardei",
      "Ersetzt die ursprünglich geplante Nacht in Morcote",
      "TODO: Unterkunft suchen und buchen",
    ],
  },
  "sina-de-la-ville": {
    title: "Sina De La Ville — 1 Nacht",
    day: "Samstag",
    datetime: "Sa 15. Aug 14:00 – So 16. Aug",
    confirmed: false,
    refs: [],
    notes: [
      "Via Ulrico Hoepli 6, 20121 Milano",
      "Rooftop-Pool · Duomo zu Fuss erreichbar",
      "Area C: Einfahrt über das Hotel anmelden",
      "TODO: aktuell favorisiert — noch nicht gebucht",
    ],
  },
  "relais-san-vigilio": {
    title: "Relais San Vigilio al Castello — 1 Nacht",
    day: "Sonntag",
    datetime: "So 16. Aug 14:00 – Mo 17. Aug",
    confirmed: false,
    refs: [],
    notes: [
      "Via al Castello 7, 24129 Bergamo",
      "Hotelgarage für den GTS reservieren",
      "Funicolare hinunter in die Città Alta",
      "TODO: Buchungsreferenz nachtragen",
    ],
  },
};

/** Alle vier Übernachtungen der Reise, in chronologischer Reihenfolge. */
export const hotels = [
  {
    id: "mergoscia",
    imageId: "mergoscia",
    name: "Mergoscia",
    city: "Verzascatal",
    address: "6647 Mergoscia, Tessin",
    googleMapsUrl: "https://maps.google.com/?q=Mergoscia+6647",
    checkIn: "Do ~02:00",
    checkOut: "Fr ~16:00",
    nights: 1,
    coordinates: { lat: 46.2086286, lng: 8.844509 },
    note: "Erste Nacht nach der Fahrt durch den Gotthard — Terrassendorf über dem Lago di Vogorno.",
  },
  {
    id: "como",
    imageId: "como",
    name: "Como",
    city: "Lago di Como",
    address: "22100 Como, Lombardei",
    googleMapsUrl: "https://maps.google.com/?q=Como+Lago+di+Como",
    checkIn: "Fr ~22:00",
    checkOut: "Sa ~13:00",
    nights: 1,
    coordinates: { lat: 45.8103, lng: 9.0832 },
    note: "Erste Nacht in Italien, direkt am See. Unterkunft steht noch aus.",
  },
  {
    id: "sina-de-la-ville",
    imageId: "duomo-milano",
    name: "Sina De La Ville",
    city: "Milano",
    address: "Via Ulrico Hoepli 6, 20121 Milano",
    website: "https://www.sinahotels.com/en/h/sina-de-la-ville-milan/",
    googleMapsUrl: "https://maps.google.com/?q=Via+Ulrico+Hoepli+6+20121+Milano",
    checkIn: "Sa 14:00",
    checkOut: "So ~13:00",
    nights: 1,
    coordinates: { lat: 45.4659654, lng: 9.1923116 },
    note: "Rooftop-Pool über den Dächern, der Duomo zwei Gehminuten entfernt. Aktuell favorisiert.",
  },
  {
    id: "relais-san-vigilio",
    imageId: "citta-alta",
    name: "Relais San Vigilio al Castello",
    city: "Bergamo",
    address: "Via al Castello 7, 24129 Bergamo",
    website: "https://www.sanvigilio.it",
    googleMapsUrl: "https://maps.google.com/?q=Via+al+Castello+7+24129+Bergamo",
    checkIn: "So 14:00",
    checkOut: "Mo ~13:00",
    nights: 1,
    coordinates: { lat: 45.7090243, lng: 9.6512689 },
    note: "Auf dem Hügel San Vigilio über der Città Alta — mit Hotelgarage für den GTS.",
  },
];

/** Kennzahlen der Fahrstrecke, gerundet aus data/car-routes.json. */
export const drive = {
  car: "Porsche Cayman GTS",
  totalKm: 731,
  totalHours: 10.4,
  legs: 6,
  passes: ["Gotthard", "Monte Ceneri"],
  /** Realverbrauch, nicht Werksangabe. */
  consumptionL100: 13,
  /** Streckenanteile pro Land, gerundet aus data/car-routes.json. */
  kmSwitzerland: 506,
  kmItaly: 225,
};

/** 731 km × 13 l/100 km ≈ 95 Liter. */
export const fuelLitres = Math.round((drive.totalKm * drive.consumptionL100) / 100);

export const budgetPaid: BudgetItem[] = [
  { label: "Sina De La Ville, Milano (1 Nacht)", amount: 320, icon: "hotel" },
  { label: "Relais San Vigilio, Bergamo (1 Nacht)", amount: 260, icon: "hotel" },
];

export const budgetOnSite: BudgetItem[] = [
  // Donnerstag
  { label: "Autobahnvignette Schweiz", amount: 43, icon: "car" },
  // Freitag
  { label: "Seven7 Ascona — Pizza & Drinks", amount: 140, icon: "utensils" },
  // Samstag
  { label: "Duomo Dachterrassen (2×)", amount: 40, icon: "landmark" },
  { label: "Dinner & Drinks Milano", amount: 280, icon: "champagne" },
  // Sonntag
  { label: "Colazione & Kaffee Milano", amount: 35, icon: "coffee" },
  { label: "Funicolare Bergamo (2×)", amount: 10, icon: "train" },
  { label: "Cena Città Alta", amount: 155, icon: "utensils" },
  // Montag
  { label: "Kaffee Città Alta", amount: 45, icon: "coffee" },
  { label: "Maut Italien (Autostrada)", amount: 28, icon: "car" },
  // Übergreifend — 13 l/100 km, Preise Stand August 2026
  { label: "Treibstoff Schweiz (506 km · CHF 1.96/l)", amount: 138, icon: "car" },
  { label: "Treibstoff Italien (225 km · 2.00 €/l)", amount: 59, icon: "car" },
  { label: "Parking & Hotelgarage", amount: 90, icon: "car" },
];

export const totalPaid = budgetPaid.reduce((s, i) => s + i.amount, 0);
export const totalOnSite = budgetOnSite.reduce((s, i) => s + i.amount, 0);
export const totalBudget = totalPaid + totalOnSite;

export function getLocation(id: string): Location | undefined {
  return locations.find((l) => l.id === id);
}

/** Tab-Index für kombinierte Ansicht: alle besuchten POIs auf einer Karte */
export const ALL_DAY_INDEX = days.length;

/**
 * Chronologische Kette aller besuchten POIs über alle Trip-Tage (ohne `hidden`).
 * Aufeinanderfolgende Events am gleichen Ort werden wie pro Tag zusammengefasst.
 */
export function getChronologicalRouteAllDays(): Location[] {
  const route: Location[] = [];
  let prevId: string | null = null;
  for (let d = 0; d < days.length; d++) {
    for (const event of days[d].events) {
      if (!event.locationId) continue;
      const loc = getLocation(event.locationId);
      if (!loc || loc.hidden) continue;
      if (event.locationId === prevId) continue;
      route.push(loc);
      prevId = event.locationId;
    }
  }
  return route;
}

/** Jeder besuchte POI nur einmal, Reihenfolge = erster Auftritt im Trip (für ALL-Ansicht). */
export function getUniqueVisitedPoisInOrder(): Location[] {
  const seen = new Set<string>();
  const out: Location[] = [];
  for (const loc of getChronologicalRouteAllDays()) {
    if (seen.has(loc.id)) continue;
    seen.add(loc.id);
    out.push(loc);
  }
  return out;
}
