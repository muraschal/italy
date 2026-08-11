"use client";

import { motion } from "framer-motion";
import {
  Car,
  Fuel,
  UtensilsCrossed,
  Wallet,
  Smartphone,
  Receipt,
  Coffee,
  type LucideIcon,
} from "lucide-react";
import {
  COFFEE_COMPARE,
  FUEL_COMPARE,
  TRAVEL_INSIGHTS,
} from "@/data/italy-travel-insights";

const ICONS: Record<(typeof TRAVEL_INSIGHTS)[number]["icon"], LucideIcon> = {
  car: Car,
  fuel: Fuel,
  utensils: UtensilsCrossed,
  wallet: Wallet,
  smartphone: Smartphone,
  receipt: Receipt,
};

function formatEur(n: number) {
  return n.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function BarRow({
  label,
  flag,
  value,
  max,
  accent,
}: {
  label: string;
  flag: string;
  value: number;
  max: number;
  accent: "accent" | "blue";
}) {
  const pct = Math.max(8, Math.round((value / max) * 100));
  const barClass =
    accent === "accent"
      ? "bg-gradient-to-r from-accent/50 to-accent/25"
      : "bg-gradient-to-r from-[#46c4bb]/55 to-[#46c4bb]/20";

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] text-text-secondary">
          <span className="text-text-primary/90 font-medium">{label}</span>
          <span className="text-text-muted/70 ml-1.5 text-[10px] font-mono">{flag}</span>
        </span>
        <span className="text-[11px] font-mono tabular-nums text-accent/90 shrink-0">
          ca. {formatEur(value)}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barClass}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export default function ItalyTravelInsights() {
  const maxCoffee = Math.max(...COFFEE_COMPARE.map((c) => c.eur));
  const maxFuel = Math.max(...FUEL_COMPARE.map((f) => f.eur));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55 }}
      className="mb-10 space-y-6"
    >
      <div className="text-center">
        <p className="text-[10px] text-text-muted uppercase tracking-[0.22em] mb-2">
          Unterwegs in Italien
        </p>
        <h3 className="text-lg sm:text-xl font-light text-text-primary tracking-tight">
          Kaffee, Sprit &amp; Strassenregeln
        </h3>
        <p className="text-[11px] text-text-muted mt-2 max-w-xl mx-auto leading-relaxed">
          Keine Finanzberatung — nur Orientierung: typische Alltagspreise entlang der Route.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Kaffee-Vergleich */}
        <div className="glass rounded-2xl border border-white/[0.06] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/15">
              <Coffee className="w-4 h-4 text-accent/80" />
            </div>
            <div>
              <p className="text-xs font-medium text-text-primary">Espresso an der Bar</p>
              <p className="text-[10px] text-text-muted">6 Orte entlang der Route · Nord nach Süd</p>
            </div>
          </div>
          <div className="space-y-3.5">
            {COFFEE_COMPARE.map((row) => (
              <BarRow
                key={row.city}
                label={row.city}
                flag={row.flag}
                value={row.eur}
                max={maxCoffee}
                accent="accent"
              />
            ))}
          </div>
          <p className="text-[9px] text-text-muted/70 mt-4 leading-relaxed border-t border-white/[0.05] pt-3">
            Der Sprung passiert an der Grenze: Was im Tessin noch über drei Euro kostet, liegt in Bergamo bei gut einem. Am Tisch mit Bedienung kommt überall ein Aufschlag dazu.
          </p>
        </div>

        {/* Spritpreis-Vergleich */}
        <div className="glass rounded-2xl border border-white/[0.06] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-[#46c4bb]/10 flex items-center justify-center border border-[#46c4bb]/20">
              <Fuel className="w-4 h-4 text-[#46c4bb]/85" />
            </div>
            <div>
              <p className="text-xs font-medium text-text-primary">Benzin 95 · pro Liter</p>
              <p className="text-[10px] text-text-muted">
                Alpenländer im Vergleich · ca. EUR (CHF umgerechnet)
              </p>
            </div>
          </div>
          <div className="space-y-3.5">
            {FUEL_COMPARE.map((row) => (
              <BarRow
                key={row.country}
                label={row.country}
                flag={row.flag}
                value={row.eur}
                max={maxFuel}
                accent="blue"
              />
            ))}
          </div>
          <p className="text-[9px] text-text-muted/70 mt-4 leading-relaxed border-t border-white/[0.05] pt-3">
            Schweiz und Italien liegen nah beieinander — der Umweg zum Tanken lohnt sich auf dieser Route nicht. Teuer wird es an den Raststätten direkt an der Autostrada.
          </p>
        </div>
      </div>

      {/* Insight-Karten */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TRAVEL_INSIGHTS.map((item, i) => {
          const Icon = ICONS[item.icon];
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3.5 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center border border-white/[0.06]">
                  <Icon className="w-3.5 h-3.5 text-accent/65" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-text-primary tracking-wide uppercase text-accent/75 mb-1">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-text-secondary leading-relaxed">{item.detail}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-[9px] text-text-muted/60 tracking-wide">
        Richtwerte · Wechselkurse &amp; Tarife ändern sich — vor Ort nochmal prüfen.
      </p>
    </motion.div>
  );
}
