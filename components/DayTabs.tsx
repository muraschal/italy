"use client";

import { motion } from "framer-motion";
import { days, ALL_DAY_INDEX } from "@/data/trip";
import { DAY_COLORS } from "@/lib/constants";

const MONTHS_SHORT = ["Jan", "Feb", "März", "April", "Mai", "Juni", "Juli", "Aug", "Sept", "Okt", "Nov", "Dez"];

/** `2026-08-13` → `{ day: "13", month: "Aug", monthNum: "08" }` */
function splitDate(iso: string) {
  const [, month, day] = iso.split("-");
  return { day, month: MONTHS_SHORT[Number(month) - 1], monthNum: month };
}

interface DayTabsProps {
  activeDay: number;
  onChange: (index: number) => void;
  /** Separate layout scope so dock + sticky tabs do not share one motion layout */
  groupId?: string;
  /** Compact pill for bottom dock — matches Navigation glass-strong */
  compact?: boolean;
}

export default function DayTabs({
  activeDay,
  onChange,
  groupId = "agenda",
  compact = false,
}: DayTabsProps) {
  const layoutId = `day-tab-bg-${groupId}`;

  return (
    <div
      className={
        compact
          ? "flex rounded-full glass-strong glow-accent p-1 gap-0.5 w-full max-w-[min(100%,24rem)]"
          : "flex rounded-xl glass p-1 gap-1"
      }
    >
      {Array.from({ length: ALL_DAY_INDEX + 1 }, (_, i) => {
        const isActive = activeDay === i;
        const color = DAY_COLORS[i] ?? DAY_COLORS[0];
        const isAll = i === ALL_DAY_INDEX;
        const day = !isAll ? days[i] : null;

        return (
          <button
            key={isAll ? "all" : day!.date}
            type="button"
            onClick={() => onChange(i)}
            className={`relative flex-1 text-center transition-colors duration-200 ${
              compact ? "py-1.5 rounded-full" : "py-2.5 rounded-lg"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className={`absolute inset-0 ${compact ? "rounded-full" : "rounded-lg"}`}
                style={{
                  background: `linear-gradient(135deg, ${color}12, ${color}08)`,
                  border: `1px solid ${color}25`,
                  boxShadow: `0 0 20px ${color}10`,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative flex flex-col items-center gap-0.5">
              <span
                className={`font-semibold uppercase tracking-[0.15em] ${
                  compact ? "text-[9px]" : "text-[10px]"
                }`}
                style={{ color: isActive ? color : undefined }}
              >
                {isActive ? undefined : (
                  <span className="text-text-muted">{isAll ? "ALL" : day!.label}</span>
                )}
                {isActive && (isAll ? "ALL" : day!.label)}
              </span>
              <span
                className={`tabular-nums ${compact ? "text-[10px]" : "text-[11px]"}`}
                style={{ color: isActive ? `${color}bb` : undefined }}
              >
                {isAll ? (
                  isActive ? (
                    <span className="opacity-80">Alle</span>
                  ) : (
                    <span className="text-text-muted/50">·</span>
                  )
                ) : isActive ? (
                  <>
                    {splitDate(day!.date).day}. {splitDate(day!.date).month}
                  </>
                ) : (
                  <span className="text-text-muted/50">
                    {splitDate(day!.date).day}.{splitDate(day!.date).monthNum}
                  </span>
                )}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
