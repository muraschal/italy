"use client";

import { motion } from "framer-motion";
import { MapPin, Globe, Moon, ExternalLink, Route, Clock, Mountain } from "lucide-react";
import { hotels, drive } from "@/data/trip";

const STATS = [
  { Icon: Route, label: "Fahrstrecke", value: `${drive.totalKm} km` },
  { Icon: Clock, label: "Fahrzeit", value: `${drive.totalHours.toFixed(1).replace(".", ",")} Std` },
  { Icon: Moon, label: "Nächte", value: String(hotels.reduce((s, h) => s + h.nights, 0)) },
  { Icon: Mountain, label: "Pässe", value: drive.passes.join(" · ") },
];

export default function HotelCard() {
  return (
    <section
      id="hotel"
      className="relative min-h-dvh flex flex-col justify-center py-16 sm:py-24 px-4 sm:px-6"
      style={{ backgroundColor: "#0c0b16" }}
    >
      <div className="absolute inset-0 texture-noise pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.12) 0%, transparent 55%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <p className="text-text-secondary text-xs tracking-[0.25em] uppercase mb-3">
            Unterkünfte · {drive.car}
          </p>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight mb-3">
            <span className="text-gradient-gold">Le Tappe</span>
          </h2>
          <p className="text-text-secondary text-sm sm:text-base font-light tracking-wide">
            Vier Nächte zwischen Verzascatal und Città Alta
          </p>
        </motion.div>

        {/* Kennzahlen der Fahrt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-gold rounded-2xl p-5 sm:p-6 mb-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2.5">
                <Icon className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-text-muted uppercase tracking-[0.15em]">{label}</p>
                  <p className="text-xs text-text-primary mt-0.5 leading-snug">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Die vier Übernachtungen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {hotels.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.15 + i * 0.08 }}
              className="glass rounded-2xl p-5 border border-gold/[0.06] hover:border-gold/[0.14] transition-colors flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="text-[10px] text-gold/70 uppercase tracking-[0.2em]">
                    Nacht {i + 1} · {h.city}
                  </p>
                  <h3 className="text-base sm:text-lg font-light text-text-primary mt-1 leading-snug">
                    {h.name}
                  </h3>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/10 text-gold text-[10px] tabular-nums">
                  <Moon className="w-2.5 h-2.5" />
                  {h.nights}
                </span>
              </div>

              <p className="text-[12px] text-text-secondary/80 leading-relaxed mb-4 flex-1">
                {h.note}
              </p>

              <div className="space-y-2 pt-3 border-t border-white/[0.05]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gold/70 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-text-primary leading-snug">{h.address}</p>
                    <a
                      href={h.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-gold/70 hover:text-gold transition-colors inline-flex items-center gap-1 mt-1"
                    >
                      Google Maps <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gold/70 shrink-0" />
                  <p className="text-[11px] text-text-primary">
                    <span className="text-gold font-medium">{h.checkIn}</span>
                    <span className="text-text-muted mx-1">→</span>
                    <span className="text-gold font-medium">{h.checkOut}</span>
                  </p>
                </div>

                {h.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-gold/70 shrink-0" />
                    <a
                      href={h.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-text-primary hover:text-gold transition-colors truncate"
                    >
                      {new URL(h.website).hostname.replace(/^www\./, "")}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
