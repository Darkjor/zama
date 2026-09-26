"use client";
// "use client": sección fija (sticky) cuyos textos avanzan con el scroll vía
// GSAP ScrollTrigger (scrub), como el hero de mantustulum.com/nosotros.

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { loadGsap, useAnimationsEnabled } from "@/lib/gsap";

type Props = {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  body1: string;
  body2: ReactNode;
  /** Versión estática: se muestra en el HTML inicial, sin JS y con movimiento reducido. */
  fallback: ReactNode;
};

export function IntroPhases({ image, imageAlt, eyebrow, title, body1, body2, fallback }: Props) {
  const root = useRef<HTMLElement>(null);
  // El HTML del servidor trae la versión estática; se cambia a la animada solo
  // en el navegador. La sección está debajo del hero, así que el cambio no se
  // ve en el primer pantallazo ni cuenta como salto de diseño (CLS).
  const animated = useAnimationsEnabled();

  useEffect(() => {
    if (!animated || !root.current) return;
    let cancelled = false;
    let cleanup = () => {};
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !root.current) return;
      const ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        const scroll = { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 };

        gsap.fromTo("[data-bg]", { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: scroll });
        gsap.set(["[data-p2]", "[data-p3]"], { autoAlpha: 0, yPercent: -50 });

        mm.add("(min-width: 1024px)", () => {
          // Escritorio: las dos tarjetas conviven (izquierda y derecha).
          gsap
            .timeline({ scrollTrigger: scroll })
            .from("[data-p1]", { autoAlpha: 0, y: 50, duration: 0.12 })
            .to("[data-p1]", { autoAlpha: 0, y: -60, duration: 0.1 }, 0.3)
            .fromTo("[data-p2]", { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: 0.12 }, 0.42)
            .fromTo("[data-p3]", { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.12 }, 0.62)
            .to({}, { duration: 0.2 });
        });
        mm.add("(max-width: 1023.98px)", () => {
          // Móvil: una tarjeta a la vez, centradas.
          gsap
            .timeline({ scrollTrigger: scroll })
            .from("[data-p1]", { autoAlpha: 0, y: 40, duration: 0.1 })
            .to("[data-p1]", { autoAlpha: 0, y: -50, duration: 0.08 }, 0.25)
            .fromTo("[data-p2]", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.35)
            .to("[data-p2]", { autoAlpha: 0, y: -40, duration: 0.08 }, 0.55)
            .fromTo("[data-p3]", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.65)
            .to({}, { duration: 0.2 });
        });
      }, root);
      ScrollTrigger.refresh();
      cleanup = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [animated]);

  if (!animated) return <>{fallback}</>;

  const card = "absolute inset-x-4 top-1/2 mx-auto max-w-md rounded-[1.75rem] bg-crema p-7 text-tinta shadow-2xl shadow-black/30 sm:p-9 lg:inset-x-auto";
  return (
    <section ref={root} id="nosotros" className="relative bg-tinta text-white" style={{ height: "340vh" }}>
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div data-bg className="absolute inset-0 will-change-transform">
          <Image src={image} alt={imageAlt} fill sizes="100vw" quality={60} className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-black/45" />

        <div data-p1 className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <Image src="/brand/iso-blanco.svg" alt="" width={371} height={367} className="size-14" />
          <p className="eyebrow mt-8 text-arena">{eyebrow}</p>
          <h2 className="display mt-5 max-w-4xl text-5xl sm:text-6xl lg:text-7xl">{title}</h2>
        </div>

        <div data-p2 className={`${card} lg:left-[6%]`}>
          <p className="text-lg leading-relaxed text-tinta-soft">{body1}</p>
        </div>
        <div data-p3 className={`${card} lg:right-[6%]`}>{body2}</div>
      </div>
    </section>
  );
}
