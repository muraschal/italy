"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Globe, Moon, ExternalLink, Route, Clock, Mountain } from "lucide-react";
import { hotels, drive, tickets } from "@/data/trip";
import imageManifest from "@/data/image-manifest.json";

/**
 * Buchungsstand kommt aus `tickets` — dort steht er ohnehin für die Popovers im
 * Tagesprogramm. Unterkünfte ohne Eintrag (z. B. privat organisiert) bekommen
 * kein Abzeichen, statt eines zu erfinden.
 */
function bookingState(hotelId: string): boolean | undefined {
  return tickets[hotelId]?.confirmed;
}

const extras = imageManifest.extras as Record<string, string | undefined>;

/** Optionales Bild des Wagens: `public/images/gts.jpg` ablegen, fertig. */
const carImage = extras.gts;

/** Sektionshintergrund hinter dem Wagen: `public/images/reise.jpg`. */
const sectionImage = extras.reise;

/** Ortsbilder für die Kartenhintergründe — `imageId` zeigt auf eine Location mit Galerie. */
const spotGalleries = imageManifest.spots as Record<string, string[] | undefined>;

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
      style={{ backgroundColor: "#070b0d" }}
    >
      {sectionImage && (
        <Image
          src={sectionImage}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          quality={72}
          className="object-cover opacity-[0.38]"
        />
      )}
      {/* Neutral abdunkeln statt einfärben — ein Teal-Schleier über dem Foto
          macht es unkenntlich, ohne es lesbarer zu machen. */}
      <div className="absolute inset-0 bg-black/62 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#070b0d] via-transparent to-[#070b0d] pointer-events-none" />
      <div className="absolute inset-0 texture-noise pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(232,132,92,0.12) 0%, transparent 55%)",
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
            <span className="text-gradient-accent">Quattro Notti</span>
          </h2>
          <p className="text-text-secondary text-sm sm:text-base font-light tracking-wide">
            Über dem Stausee, am Comer See, mitten in Mailand, über der Città Alta
          </p>
        </motion.div>

        {/* Kennzahlen der Fahrt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-accent rounded-2xl p-5 sm:p-6 mb-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2.5">
                <Icon className="w-4 h-4 text-accent mt-0.5 shrink-0" />
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
              className="relative overflow-hidden glass rounded-2xl p-5 border border-accent/[0.06] hover:border-accent/[0.14] transition-colors flex flex-col"
            >
              {/* Ortsbild als Kartenhintergrund — kräftig abgedunkelt, damit
                  Adresse und Zeiten lesbar bleiben. */}
              {spotGalleries[h.imageId]?.[0] && (
                <div className="absolute inset-0 -z-10" aria-hidden>
                  <Image
                    src={spotGalleries[h.imageId]![0]}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 32rem"
                    quality={70}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/84 to-black/93" />
                </div>
              )}

              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="text-[10px] text-accent/70 uppercase tracking-[0.2em]">
                    Nacht {i + 1} · {h.city}
                  </p>
                  <h3 className="text-base sm:text-lg font-light text-text-primary mt-1 leading-snug">
                    {h.name}
                  </h3>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {bookingState(h.id) === false && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300/90 border border-amber-400/20 text-[9px] uppercase tracking-[0.14em] font-semibold">
                      Offen
                    </span>
                  )}
                  {bookingState(h.id) === true && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/[0.06] text-text-secondary border border-white/[0.06] text-[9px] uppercase tracking-[0.14em] font-semibold">
                      Gebucht
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] tabular-nums">
                    <Moon className="w-2.5 h-2.5" />
                    {h.nights}
                  </span>
                </div>
              </div>

              <p className="text-[12px] text-text-secondary/80 leading-relaxed mb-4 flex-1">
                {h.note}
              </p>

              <div className="space-y-2 pt-3 border-t border-white/[0.05]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-accent/70 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-text-primary leading-snug">{h.address}</p>
                    <a
                      href={h.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-accent/70 hover:text-accent transition-colors inline-flex items-center gap-1 mt-1"
                    >
                      Google Maps <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-accent/70 shrink-0" />
                  <p className="text-[11px] text-text-primary">
                    <span className="text-accent font-medium">{h.checkIn}</span>
                    <span className="text-text-muted mx-1">→</span>
                    <span className="text-accent font-medium">{h.checkOut}</span>
                  </p>
                </div>

                {h.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-accent/70 shrink-0" />
                    <a
                      href={h.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-text-primary hover:text-accent transition-colors truncate"
                    >
                      {new URL(h.website).hostname.replace(/^www\./, "")}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Der Wagen als Abschluss der Sektion — public/images/gts.jpg */}
        {carImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden mt-6 aspect-[21/9] sm:aspect-[3/1]"
          >
            <Image
              src={carImage}
              alt={drive.car}
              fill
              sizes="(max-width: 1024px) 100vw, 64rem"
              className="object-cover"
              quality={82}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b0d] via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 flex items-center gap-2.5">
              <span aria-hidden className="flex h-3 w-3 overflow-hidden rounded-full shadow-lg">
                <span className="w-1/3 bg-[#008C45]" />
                <span className="w-1/3 bg-[#F4F5F0]" />
                <span className="w-1/3 bg-[#CD212A]" />
              </span>
              <p className="text-[10px] sm:text-[11px] text-white/90 tracking-[0.22em] uppercase drop-shadow-lg">
                {drive.car} · {drive.consumptionL100} l/100 km
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
