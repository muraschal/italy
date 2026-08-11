/**
 * CHF pro 1 EUR — Devisenmittelkurs vom 11. August 2026.
 * Beim Aktualisieren auch die Preisangaben in `data/trip.ts` prüfen, die als
 * Klartext im Label stehen (z. B. „CHF 1.96/l“).
 */
export const CHF_PER_EUR = 0.9344;

export type TripCurrency = "EUR" | "CHF";

export function eurToChf(eur: number): number {
  return eur * CHF_PER_EUR;
}

const chfIntl = new Intl.NumberFormat("de-CH", {
  style: "currency",
  currency: "CHF",
});

/**
 * Beträge in `trip.ts` sind in EUR gespeichert; Anzeige in CHF umgerechnet.
 */
export function formatBudgetMoney(amountEur: number, currency: TripCurrency): string {
  if (currency === "EUR") {
    return `${Math.round(amountEur)}€`;
  }
  return chfIntl.format(eurToChf(amountEur));
}
