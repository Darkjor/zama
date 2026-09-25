"use client";
// "use client": al entrar en pantalla, una barra color caoba barre de
// izquierda a derecha y descubre el contenido (como la transición
// Aspiración -> Propósito de mantustulum.com/nosotros).

import { useEffect, useRef, type ReactNode } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/gsap";

export function Curtain({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || prefersReducedMotion()) return;
    let cancelled = false;
    let cleanup = () => {};
    loadGsap().then(({ gsap }) => {
      if (cancelled || !root.current) return;
      const ctx = gsap.context(() => {
        gsap.set("[data-content]", { autoAlpha: 0 });
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 78%", once: true } })
          .fromTo("[data-bar]", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.5, ease: "power2.inOut" })
          .set("[data-content]", { autoAlpha: 1 })
          .to("[data-bar]", { scaleX: 0, transformOrigin: "right center", duration: 0.55, ease: "power2.inOut" });
      }, root);
      cleanup = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div ref={root} className={`relative isolate overflow-hidden ${className}`}>
      <div data-content className="h-full">
        {children}
      </div>
      <span data-bar aria-hidden className="pointer-events-none absolute inset-0 z-10 origin-left scale-x-0 bg-caoba" />
    </div>
  );
}
