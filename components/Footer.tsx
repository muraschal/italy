"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ExternalLink } from "lucide-react";
import { locations } from "@/data/trip";
import imageManifest from "@/data/image-manifest.json";

/** Letzte Station der Reise als Ausklang. */
const BG_IMAGE = (imageManifest.spots as Record<string, string[] | undefined>)["citta-alta"]?.[0];

export default function Footer() {
  return (
    <footer className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden" style={{ backgroundColor: "#061a20" }}>
      {BG_IMAGE && (
        <Image
          src={BG_IMAGE}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          quality={70}
          className="object-cover opacity-25"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#061a20] via-[#061a20]/70 to-[#061a20] pointer-events-none" />
      <div className="absolute inset-0 texture-noise pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(232,132,92,0.16) 0%, rgba(232,132,92,0.04) 45%, transparent 75%)" }}
      />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="inline-block mb-6"
          >
            <Heart className="w-6 h-6 text-aqua fill-aqua/20" />
          </motion.div>

          <h3 className="text-2xl sm:text-3xl font-light tracking-tight mb-2">
            <span className="text-gradient-aqua">Buon viaggio</span>
          </h3>
          <p className="text-text-secondary text-sm">
            Tessin · Milano · Bergamo — August 2026
          </p>

          {/* Quick Links Grid */}
          <div className="mt-12 pt-8 border-t border-glass-border">
            <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mb-4">
              Quick Navigation
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {locations
                .filter((l) => l.category !== "hotel")
                .slice(0, 12)
                .map((loc) => (
                  <a
                    key={loc.id}
                    href={loc.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-text-muted hover:text-accent hover:bg-glass transition-all group"
                  >
                    <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    <span className="truncate">{loc.name}</span>
                  </a>
                ))}
            </div>
          </div>

          {/* Pflichtangabe: Die Kartengrafik im Header steht unter CC BY-SA 3.0. */}
          <p className="mt-10 text-text-muted/70 text-[9px] leading-relaxed">
            Kartengrafik Italien:{" "}
            <a
              href="https://commons.wikimedia.org/wiki/File:Italy_looking_like_the_flag.svg"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted hover:text-text-secondary"
            >
              Mnemoc
            </a>
            ,{" "}
            <a
              href="https://creativecommons.org/licenses/by-sa/3.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted hover:text-text-secondary"
            >
              CC BY-SA 3.0
            </a>
          </p>

          <p className="mt-4 text-text-muted text-[10px]">
            Made with love in 2026
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
