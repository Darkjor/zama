"use client";
// "use client": detecta la intención de salida (cursor saliendo por arriba en
// escritorio, scroll rápido hacia arriba en móvil) y abre un <dialog>.

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "@phosphor-icons/react/ssr";
import { useTranslations } from "next-intl";
import { LeadForm, LEAD_SENT_KEY } from "./LeadForm";

const SEEN_KEY = "zama-exit-visto"; // sessionStorage: una vez por visita
const NEVER_KEY = "zama-exit-nunca"; // localStorage: "no volver a mostrar"
const MIN_TIME_MS = 8000; // no interrumpir a quien acaba de llegar

function store(kind: "local" | "session") {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function blocked() {
  return (
    store("session")?.getItem(SEEN_KEY) === "1" ||
    store("local")?.getItem(NEVER_KEY) === "1" ||
    store("local")?.getItem(LEAD_SENT_KEY) === "1"
  );
}

export function ExitIntent() {
  const t = useTranslations("exit");
  const dialog = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);

  const open = useCallback(() => {
    const d = dialog.current;
    if (!d || d.open || blocked()) return;
    store("session")?.setItem(SEEN_KEY, "1");
    setMounted(true);
    d.showModal();
  }, []);

  useEffect(() => {
    if (blocked()) return;
    const start = Date.now();
    const ready = () => Date.now() - start > MIN_TIME_MS;

    // Escritorio: el cursor sale de la ventana por el borde superior.
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0 && ready()) open();
    };

    // Móvil: scroll rápido hacia arriba después de haber bajado un buen tramo.
    // Se mide el tramo continuo de subida (un celular emite muchos eventos
    // pequeños): si sube más de 250 px a más de 1 px/ms, se considera salida.
    // El tramo arranca con el PRIMER movimiento hacia arriba (no en el último
    // hacia abajo), para que una pausa de lectura no diluya la velocidad.
    let lastY = window.scrollY;
    let maxY = lastY;
    let upStart: { y: number; t: number } | null = null;
    const onScroll = () => {
      const y = window.scrollY;
      const now = performance.now();
      maxY = Math.max(maxY, y);
      if (y >= lastY) {
        upStart = null;
      } else {
        upStart ??= { y: lastY, t: now - 16 };
        const up = upStart.y - y;
        const speed = up / Math.max(1, now - upStart.t);
        if (up > 250 && speed > 1 && maxY > window.innerHeight * 2 && ready()) open();
      }
      lastY = y;
    };

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) window.addEventListener("scroll", onScroll, { passive: true });
    else document.addEventListener("mouseout", onMouseOut);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [open]);

  const close = () => dialog.current?.close();
  const never = () => {
    store("local")?.setItem(NEVER_KEY, "1");
    close();
  };

  return (
    <dialog
      ref={dialog}
      aria-labelledby="exit-title"
      onClick={(e) => e.target === dialog.current && close()}
      className="exit-dialog m-auto w-[min(56rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-auto rounded-[1.75rem] bg-crema p-0 text-tinta shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      {mounted && (
        <div className="grid md:grid-cols-[1fr_1.1fr]">
          <div className="relative hidden min-h-[30rem] md:block">
            <Image src="/img/villa-atardecer.webp" alt="" fill sizes="28rem" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <Image src="/brand/logo-blanco.svg" alt="" width={983} height={805} className="absolute bottom-8 left-8 h-20 w-auto" />
          </div>
          <div className="relative p-6 sm:p-9">
            <button
              type="button"
              onClick={close}
              aria-label={t("close")}
              className="absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-full text-tinta-soft hover:bg-arena/60 hover:text-tinta"
            >
              <X className="size-5" aria-hidden />
            </button>
            <p className="eyebrow text-terracota">{t("eyebrow")}</p>
            <h2 id="exit-title" className="display mt-3 pr-8 text-4xl">
              {t("title")}
            </h2>
            <p className="mt-3 leading-relaxed text-tinta-soft">{t("body")}</p>
            <LeadForm variant="brochure" className="mt-6 !p-6 !shadow-none" />
            <button type="button" onClick={never} className="font-ui mt-4 w-full text-center text-xs text-tinta-soft underline underline-offset-2 hover:text-tinta">
              {t("noMostrar")}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
