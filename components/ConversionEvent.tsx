"use client";
// "use client": empuja el evento de conversión a dataLayer (GTM) al montar.

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Emite `lead_submit` una sola vez por envío. El formulario deja una marca en
 * sessionStorage justo antes de redirigir aquí; si alguien abre /gracias
 * directo (o recarga), no hay marca y no se cuenta una conversión falsa.
 */
export function ConversionEvent({ tipo }: { tipo: string }) {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("zama-lead-pendiente") !== "1") return;
      sessionStorage.removeItem("zama-lead-pendiente");
    } catch {
      return;
    }
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event: "lead_submit", lead_tipo: tipo });
  }, [tipo]);
  return null;
}
