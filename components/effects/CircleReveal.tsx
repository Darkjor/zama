"use client";
// "use client": la foto se abre desde un círculo hasta llenar la pantalla
// con el scroll (clip-path + GSAP ScrollTrigger), como "Aspiración" de
// mantustulum.com/nosotros.

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { loadGsap, useAnimationsEnabled } from "@/lib/gsap";

type Props = {
  image: string;
  title: string;
  /** Contenido que aparece cuando la foto ya llenó la pantalla. */
  children: ReactNode;
  /** Versión estática (HTML inicial, sin JS, movimiento reducido). */
  fallback: ReactNode;
};

export function CircleReveal({ image, title, children, fallback }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const animated = useAnimationsEnabled();

  useEffect(() => {
    if (!animated || !root.current) return;
    let cancelled = false;
    let cleanup = () => {};
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !root.current) return;
      const ctx = gsap.context(() => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.5, invalidateOnRefresh: true } })
          .fromTo("[data-circle]", { clipPath: "circle(16% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", ease: "power1.inOut", duration: 0.5 })
          .fromTo("[data-img]", { scale: 1.25 }, { scale: 1, ease: "none", duration: 0.5 }, 0)
          // El título arranca centrado dentro del círculo y sube a su lugar
          // (en móvil su lugar queda arriba, fuera del círculo inicial).
          // offsetTop ignora transforms, así que la medida es estable.
          .fromTo(
            "[data-title]",
            {
              scale: 0.55,
              y: () => {
                const el = root.current!.querySelector<HTMLElement>("[data-title]")!;
                const box = el.offsetParent as HTMLElement;
                return box.offsetHeight / 2 - (el.offsetTop + el.offsetHeight / 2);
              },
            },
            { scale: 1, y: 0, duration: 0.5 },
            0,
          )
          .fromTo("[data-body]", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.55)
          .to({}, { duration: 0.25 });
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

  return (
    <div ref={root} className="relative" style={{ height: "260vh" }}>
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div data-circle className="absolute inset-0 overflow-hidden bg-tinta" style={{ clipPath: "circle(16% at 50% 50%)" }}>
          <div data-img className="absolute inset-0 will-change-transform">
            <Image src={image} alt="" fill sizes="100vw" quality={60} className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <h3 data-title className="display text-5xl text-arena sm:text-6xl lg:text-7xl">
            {title}
          </h3>
          <div data-body className="mt-8 w-full max-w-4xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
