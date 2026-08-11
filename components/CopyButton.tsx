"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  /** The text value to copy to clipboard. */
  value: string;
}

/**
 * Copy-to-clipboard button für die Referenz-Popovers im Tagesprogramm.
 * Fällt still zurück, wenn die Clipboard-API nicht verfügbar ist (HTTP, alte Browser).
 */
export default function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silent fail
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={copy}
      className="ml-2 p-1 rounded hover:bg-glass-hover transition-colors"
      aria-label="Kopieren"
    >
      {copied ? (
        <Check className="w-3 h-3 text-accent-green" />
      ) : (
        <Copy className="w-3 h-3 text-text-muted" />
      )}
    </button>
  );
}
