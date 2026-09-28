"use client";
// "use client": usa la hoja nativa de compartir del teléfono (Web Share API)
// y, donde no existe (casi todo escritorio), copia el enlace al portapapeles.

import { useState } from "react";
import { ShareNetwork } from "@phosphor-icons/react/ssr";

type Props = {
  url: string;
  title: string;
  text: string;
  label: string;
  copiedLabel: string;
  className?: string;
};

export function ShareButton({ url, title, text, label, copiedLabel, className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ url, title, text });
      } catch {
        // El usuario cerró la hoja de compartir: no hay nada que hacer.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sin permiso de portapapeles: se deja el botón como está.
    }
  }

  return (
    <button type="button" onClick={share} className={`font-ui inline-flex items-center justify-center gap-2 transition-colors ${className}`}>
      <ShareNetwork className="size-4" aria-hidden />
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
