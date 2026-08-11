"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coffee, Hotel, Waves, Wine, UtensilsCrossed, Sunset,
  Sparkles, Star, Moon, Car, Landmark, Camera, Music,
  Heart, MapIcon, IceCreamCone, Plane, Luggage,
  ExternalLink, GlassWater, TrainFront, Mountain, ShoppingBag,
  Ticket, X, Footprints,
} from "lucide-react";
import type { TripEvent, TicketInfo } from "@/data/trip";
import { getLocation, tickets } from "@/data/trip";
import CopyButton from "./CopyButton";
import { HOVER_COLOR } from "@/lib/constants";
import imageManifest from "@/data/image-manifest.json";

/**
 * Hintergrundbilder pro Ort. Kommt aus `data/image-manifest.json`, das vor jedem
 * Build aus `public/images/events/` erzeugt wird — eine Datei `<location-id>.jpg`
 * genügt, hier ist nichts einzutragen.
 */
const EVENT_IMAGE_BY_LOCATION = imageManifest.events as Record<string, string | undefined>;

/** Fällt auf das erste Galeriebild des Orts zurück, wenn kein eigenes Event-Bild existiert. */
const SPOT_GALLERIES = imageManifest.spots as Record<string, string[] | undefined>;

/**
 * Event-Titel → Dateiname, damit mehrere Programmpunkte am selben Ort eigene
 * Bilder bekommen können. „Abfahrt Richtung Süden“ sucht also nach
 * `public/images/events/abfahrt-richtung-sueden.jpg`.
 */
function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Reihenfolge: eigenes Bild für diesen Programmpunkt, sonst das Ortsbild unter
 * `events/`, sonst das erste Galeriebild des Orts.
 */
function getEventImage(event: TripEvent): string | undefined {
  const byTitle = EVENT_IMAGE_BY_LOCATION[slugifyTitle(event.title)];
  if (byTitle) return byTitle;
  if (!event.locationId) return undefined;
  return EVENT_IMAGE_BY_LOCATION[event.locationId] ?? SPOT_GALLERIES[event.locationId]?.[0];
}

const iconMap: Record<string, React.ElementType> = {
  coffee: Coffee,
  hotel: Hotel,
  waves: Waves,
  wine: Wine,
  utensils: UtensilsCrossed,
  sunset: Sunset,
  sparkles: Sparkles,
  star: Star,
  moon: Moon,
  car: Car,
  landmark: Landmark,
  camera: Camera,
  music: Music,
  heart: Heart,
  map: MapIcon,
  iceCream: IceCreamCone,
  plane: Plane,
  luggage: Luggage,
  champagne: GlassWater,
  train: TrainFront,
  footprints: Footprints,
  mountain: Mountain,
  shopping: ShoppingBag,
};

function TicketPopover({ ticket, onClose }: { ticket: TicketInfo; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-8 z-20 w-56 p-3 rounded-xl glass-strong border border-accent/20 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-2 right-2 p-0.5 rounded hover:bg-glass-hover transition-colors">
        <X className="w-3 h-3 text-text-muted" />
      </button>
      <p className="text-[10px] text-accent uppercase tracking-wider font-semibold mb-2">Ticket-Info</p>
      <div className="space-y-1.5">
        {ticket.refs.map((ref) => (
          <div key={ref.value} className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted">{ref.label}</span>
            <span className="flex items-center font-mono text-[10px] text-text-secondary">
              {ref.value.length > 12 ? `${ref.value.slice(0, 6)}…${ref.value.slice(-4)}` : ref.value}
              <CopyButton value={ref.value} />
            </span>
          </div>
        ))}
        {ticket.cancellation && (
          <p className="text-accent-red/70 text-[9px] mt-1">{ticket.cancellation}</p>
        )}
      </div>
    </motion.div>
  );
}

interface HoveredSegment {
  fromId: string;
  toId: string;
}

interface TimelineEventProps {
  event: TripEvent;
  eventKey: string;
  isLast: boolean;

  hoveredEventKey?: string | null;
  hoveredLocationId?: string | null;
  hoveredSegment?: HoveredSegment | null;
  onHoverEvent?: (locationId: string | null, eventKey: string | null) => void;
}

/** Threshold: viewports taller than this get fun facts inline (no collapse). */
const TALL_VIEWPORT_PX = 1100;

function useTallViewport() {
  const [isTall, setIsTall] = useState(false);
  useEffect(() => {
    const check = () => setIsTall(window.innerHeight >= TALL_VIEWPORT_PX);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isTall;
}

export default function TimelineEventCard({ event, eventKey, isLast, hoveredEventKey, hoveredLocationId, hoveredSegment, onHoverEvent }: TimelineEventProps) {
  const [showTicket, setShowTicket] = useState(false);
  const [factOpen, setFactOpen] = useState(false);
  const isTallScreen = useTallViewport();
  const Icon = iconMap[event.icon] || Star;
  const location = event.locationId ? getLocation(event.locationId) : null;
  const ticket: TicketInfo | undefined = event.ticketRef ? tickets[event.ticketRef] : undefined;
  const hasTicket = ticket && ticket.refs.length > 0;
  /**
   * „Gebucht“ nur, wenn wirklich gebucht. Vorher genügte ein `ticketRef` —
   * also die blosse Existenz eines Reservationseintrags — und das Badge stand
   * auf sieben Programmpunkten, obwohl keine einzige Buchung bestätigt ist.
   * Der Buchungsstand lebt in `tickets[...].confirmed`.
   */
  const isBooked = (ticket?.confirmed ?? false) || event.costPaid === true;
  const isFixedTime = !event.time.startsWith("~") && event.time !== "Late";

  const anyHoverActive =
    hoveredEventKey != null || hoveredSegment != null || hoveredLocationId != null;
  /** Karten-Hover setzt nur locationId; Timeline-Hover setzt eventKey — dann nur exaktes Event, nicht alle am gleichen Ort. */
  const isHovered =
    hoveredEventKey === eventKey ||
    (hoveredEventKey == null &&
      !!event.locationId &&
      hoveredLocationId === event.locationId);

  const duration = (() => {
    if (!event.endTime) return null;
    const parse = (t: string) => {
      const clean = t.replace("~", "");
      if (clean === "Late") return null;
      const [h, m] = clean.split(":").map(Number);
      return h * 60 + m;
    };
    const start = parse(event.time);
    const end = parse(event.endTime);
    if (start == null || end == null) return null;
    let diff = end - start;
    if (diff < 0) diff += 24 * 60;
    if (diff < 60) return `${diff} Min`;
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;
    return mins > 0 ? `${hrs}h${mins.toString().padStart(2, "0")}` : `${hrs}h`;
  })();

  return (
    <div
      className={`flex gap-4 sm:gap-5 transition-opacity duration-200 ${
        anyHoverActive && !isHovered ? "opacity-40" : "opacity-100"
      } ${event.locationId ? "cursor-pointer" : ""}`}
      onMouseEnter={() => onHoverEvent?.(event.locationId || null, eventKey)}
      onMouseLeave={() => onHoverEvent?.(null, null)}
    >
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center pt-1.5 shrink-0">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
            isHovered
              ? "scale-110"
              : isBooked
                ? "glass-accent glow-accent-strong ring-1 ring-accent/30"
                : event.highlight
                  ? "glass-accent glow-accent-strong"
                  : "glass"
          }`}
          style={isHovered ? {
            background: `${HOVER_COLOR}2d`,
            boxShadow: `0 0 20px ${HOVER_COLOR}66, 0 0 6px ${HOVER_COLOR}40, inset 0 0 8px ${HOVER_COLOR}1a`,
            border: `2px solid ${HOVER_COLOR}`,
          } : undefined}
        >
          <Icon className={`w-4 h-4 transition-colors duration-200 ${isHovered ? `text-[${HOVER_COLOR}]` : event.highlight || isBooked ? "text-accent" : "text-text-secondary"}`} />
        </div>
        {!isLast && (
          <div className="w-px flex-1 min-h-[28px] bg-gradient-to-b from-glass-border to-transparent mt-2" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-7 sm:pb-8 min-w-0 relative">
        {/* Unified card background */}
        <div className={`absolute -top-1.5 -left-2.5 -right-2.5 bottom-2 rounded-xl overflow-hidden pointer-events-none border transition-all duration-200`} style={isHovered ? {
          borderColor: `${HOVER_COLOR}40`,
          boxShadow: `0 0 24px ${HOVER_COLOR}26`,
        } : isBooked ? {
          borderColor: "rgb(212, 175, 55, 0.12)",
        } : {
          borderColor: "rgb(255, 255, 255, 0.06)",
        }}>
          {/* Deckende Grundfläche: Die Tagesspalte trägt ein Foto — ohne sie
              scheint es durch die Karte und der Text wird unlesbar. Der
              Zustands-Farbton liegt als Verlaufsebene darüber. */}
          <div className="absolute inset-0 backdrop-blur-[2px] transition-colors duration-200" style={isHovered ? {
            background: `linear-gradient(${HOVER_COLOR}24, ${HOVER_COLOR}24), rgba(8, 28, 36, 0.9)`,
          } : isBooked ? {
            background: "linear-gradient(rgba(232,132,92,0.07), rgba(232,132,92,0.07)), rgba(8, 28, 36, 0.88)",
          } : {
            background: "rgba(8, 28, 36, 0.86)",
          }} />
          {/* Mobil schmaler und stärker abgedunkelt — auf 375 px reicht der
              Textbereich sonst unter das Bild und wird unlesbar. */}
          {getEventImage(event) && (
            <div
              className="absolute top-0 bottom-0 right-0 w-[24%] sm:w-[30%]"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, black 70%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 70%)",
              }}
            >
              {/* Über next/image statt als CSS-Hintergrund: Als background-image
                  ging das Original ungerechnet an den Browser — gemessen 408 KB
                  für einen rund 100 px breiten Streifen. */}
              <Image
                src={getEventImage(event)!}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 640px) 25vw, 160px"
                quality={60}
                className="object-cover"
              />
              <div
                className={`absolute inset-0 ${
                  isBooked ? "bg-ink/65 sm:bg-ink/45" : "bg-ink/70 sm:bg-ink/55"
                }`}
              />
            </div>
          )}
        </div>
        <div className="relative">
          {/* Row 1: Time + badges + action buttons */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className={`text-xs font-mono tabular-nums ${isBooked ? "text-accent font-semibold" : isFixedTime ? "text-text-primary" : "text-text-muted"}`}>
                {event.time}
                {event.endTime && `–${event.endTime}`}
              </span>
              {isBooked && (
                <span className="inline-flex items-center justify-center min-h-5 px-1.5 py-0 text-[8px] leading-none rounded-full bg-accent/15 text-accent uppercase tracking-[0.15em] font-semibold border border-accent/20">
                  Gebucht
                </span>
              )}
              {duration && (
                <span className="inline-flex items-center justify-center min-h-5 px-1.5 py-0 text-[9px] leading-none rounded-full bg-glass text-text-secondary tabular-nums">
                  ⏱ {duration}
                </span>
              )}
              {event.transport === "car" && (
                <span className="inline-flex items-center justify-center min-h-5 px-1.5 py-0 text-[9px] leading-none rounded-full bg-glass text-text-muted uppercase tracking-wider">
                  🚗 {event.transportDuration ?? "Auto"}
                </span>
              )}
              {event.transport === "metro" && (
                <span className="inline-flex items-center justify-center min-h-5 px-1.5 py-0 text-[9px] leading-none rounded-full bg-[#3aa8c4]/15 text-[#3aa8c4] border border-[#3aa8c4]/20 uppercase tracking-wider">
                  🚇 Bahn {event.transportDuration && `· ${event.transportDuration}`}
                </span>
              )}
              {event.transport === "walk" && event.transportDuration && (
                <span className="inline-flex items-center justify-center min-h-5 px-1.5 py-0 text-[9px] leading-none rounded-full bg-glass text-text-muted uppercase tracking-wider">
                  🚶 {event.transportDuration}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 shrink-0 relative">
              {hasTicket && (
                <button
                  onClick={(e) => { e.stopPropagation(); setShowTicket(!showTicket); }}
                  className="p-1.5 rounded-lg glass hover:glass-strong transition-all group"
                  aria-label="Ticket-Info"
                >
                  <Ticket className="w-3.5 h-3.5 text-accent/60 group-hover:text-accent transition-colors" />
                </button>
              )}
              {location?.instagramUrl && (
                <a
                  href={location.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg glass hover:glass-strong transition-all group"
                  aria-label={`${location.name} auf Instagram`}
                >
                  <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-[#E1306C] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
              )}
              {location && (
                <a
                  href={location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg glass hover:glass-strong transition-all group"
                  aria-label={`${location.name} auf Google Maps öffnen`}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors" />
                </a>
              )}
              <AnimatePresence>
                {showTicket && ticket && (
                  <TicketPopover ticket={ticket} onClose={() => setShowTicket(false)} />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Row 2: Title */}
          <h4 className={`text-sm sm:text-[15px] font-medium mt-1.5 leading-snug ${isBooked ? "text-text-primary" : event.highlight ? "text-text-primary" : "text-text-primary/80"}`}>
            {event.title}
          </h4>

          {/* Row 3: Description */}
          {event.description && (
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">{event.description}</p>
          )}

          {/* Row 4: Note */}
          {event.note && (
            <p className="text-[11px] text-accent/80 mt-1.5 flex items-center gap-1">
              <span className="text-accent">⚡</span> {event.note}
            </p>
          )}

          {event.funFact && (
            isTallScreen ? (
              /* Large viewport: always visible */
              <p className="text-[11px] mt-2.5 leading-relaxed tracking-wide" style={{ color: "rgba(240, 236, 228, 0.7)" }}>
                {event.funFact}
              </p>
            ) : (
              /* Compact viewport: collapsible */
              <div className="mt-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFactOpen(!factOpen); }}
                  className="flex items-center gap-1.5 text-[10px] text-text-muted hover:text-accent/80 transition-colors"
                >
                  <span className="text-accent/90">{factOpen ? "▾" : "▸"}</span>
                  <span className="uppercase tracking-[0.1em] font-medium">Fun Fact</span>
                </button>
                <AnimatePresence initial={false}>
                  {factOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-[11px] mt-1.5 leading-relaxed tracking-wide" style={{ color: "rgba(240, 236, 228, 0.7)" }}>
                        {event.funFact}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
