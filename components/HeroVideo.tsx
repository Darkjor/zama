"use client";
// "use client": el video se adjunta después de la carga, cuando el navegador
// está libre, para que no compita con la foto del hero (el LCP).

import { useEffect, useRef, useState } from "react";

type NavigatorConnection = Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };

/**
 * Video de fondo del hero con carga diferida. La foto del hero (HeroPicture)
 * queda debajo y es lo primero que se pinta; el video aparece encima con un
 * fundido cuando ya puede reproducirse. Mide 1px menos de alto que la foto a
 * propósito: así nunca es "más grande" que ella y no se vuelve el LCP.
 * No se descarga con movimiento reducido, ahorro de datos o conexiones 2G.
 */
export function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const conn = (navigator as NavigatorConnection).connection;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (conn?.saveData || /2g/.test(conn?.effectiveType ?? "")) return;

    const start = () => setLoad(true);
    // Safari no tiene requestIdleCallback: ahí basta con esperar un poco.
    const idle = () => (typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 1200));
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
    return () => window.removeEventListener("load", idle);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!load || !v) return;
    // Un <source> agregado después del montaje no se toma solo: hay que
    // pedirle al video que vuelva a leer sus fuentes.
    v.load();
    v.play().catch(() => {});
  }, [load]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      autoPlay
      preload="none"
      aria-hidden
      onCanPlay={() => setReady(true)}
      className={`absolute inset-x-0 top-0 bottom-px -z-10 h-[calc(100%-1px)] w-full object-cover transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
    >
      {load && <source src={src} type="video/webm" />}
    </video>
  );
}
