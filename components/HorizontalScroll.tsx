"use client";
// "use client": la sección se fija en pantalla y el scroll vertical mueve las
// tarjetas en horizontal; eso requiere medir el track y escuchar el scroll.

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";

export type HCard = { tag: string; title: string; body: string; image: string };

type Props = {
  eyebrow: string;
  title: string;
  hint: string;
  watermark: string;
  cards: HCard[];
  cta: ReactNode;
};

export function HorizontalScroll({ eyebrow, title, hint, watermark, cards, cta }: Props) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const el = section.current;
    const tr = track.current;
    if (!el || !tr) return;

    // Distancia que debe recorrer el track = su ancho menos el viewport. La
    // sección mide eso + una pantalla, para que el scroll vertical "dure"
    // exactamente lo que tarda el recorrido horizontal.
    let distance = 0;
    const measure = () => {
      distance = Math.max(0, tr.scrollWidth - window.innerWidth);
      setHeight(distance + window.innerHeight);
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      const top = el.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, -top / Math.max(1, distance)));
      tr.style.transform = `translate3d(${-progress * distance}px,0,0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    measure();
    update();
    const ro = new ResizeObserver(() => {
      measure();
      update();
    });
    ro.observe(tr);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const pinned = height !== null;

  return (
    <section ref={section} className="relative bg-selva text-white" style={pinned ? { height } : undefined} aria-label={title}>
      <div className={`${pinned ? "sticky top-0 h-dvh" : ""} flex flex-col justify-center overflow-hidden py-20`}>
        <p
          aria-hidden
          className="display pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[22vw] leading-none whitespace-nowrap text-white/[0.04] select-none"
        >
          {watermark}
        </p>

        <div
          ref={track}
          className={`relative flex items-stretch gap-6 px-4 will-change-transform sm:px-6 lg:gap-8 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] ${pinned ? "w-max" : "no-scrollbar snap-x snap-mandatory overflow-x-auto"}`}
        >
          <div className="flex w-[80vw] shrink-0 snap-start flex-col justify-center sm:w-[26rem]">
            <p className="eyebrow text-agua">{eyebrow}</p>
            <h2 className="display mt-4 text-5xl sm:text-6xl lg:text-7xl">{title}</h2>
            <p className="font-ui mt-8 flex items-center gap-3 text-sm text-white/60">
              {hint}
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                <path d="M4 12h16m-5-5l5 5-5 5" />
              </svg>
            </p>
            <div className="mt-8">{cta}</div>
          </div>

          {cards.map((c, i) => (
            <article
              key={c.title}
              className="group relative isolate flex h-[min(34rem,68dvh)] w-[78vw] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-[1.75rem] ring-1 ring-white/10 sm:w-[22rem] lg:w-[24rem]"
              style={{ marginTop: i % 2 ? "2.5rem" : 0 }}
            >
              <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 24rem, 78vw" className="-z-10 object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0d2a1f] via-[#0d2a1f]/55 to-transparent" />
              <span className="eyebrow absolute top-5 left-5 rounded-full bg-selva/80 px-3.5 py-1.5 text-[0.65rem] text-agua backdrop-blur-sm">{c.tag}</span>
              <div className="p-6 sm:p-7">
                <h3 className="display text-3xl">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">{c.body}</p>
              </div>
            </article>
          ))}
          <div className="w-4 shrink-0 lg:w-8" aria-hidden />
        </div>
      </div>
    </section>
  );
}
