"use client";
// "use client": la sección se fija en pantalla y el scroll vertical mueve las
// tarjetas en horizontal; eso requiere medir el track y escuchar el scroll.

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";

export type HCard = { tag: string; title: string; body: string; image: string };

type Props = {
  title: string;
  watermark: string;
  cards: HCard[];
  cta: ReactNode;
};

export function HorizontalScroll({ title, watermark, cards, cta }: Props) {
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
      // Paralaje: la foto de cada tarjeta se desplaza un poco en sentido
      // contrario al track, así la tarjeta se siente como una ventana.
      const mid = window.innerWidth / 2;
      tr.querySelectorAll<HTMLElement>("[data-parallax]").forEach((img) => {
        const r = img.parentElement!.getBoundingClientRect();
        const offset = (r.left + r.width / 2 - mid) / window.innerWidth;
        img.style.transform = `translate3d(${offset * -48}px,0,0) scale(1.12)`;
      });
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
    <section ref={section} className="relative overflow-x-clip bg-selva text-white" style={pinned ? { height } : undefined} aria-label={title}>
      {/* sticky o relative: siempre posicionado, para que overflow-hidden recorte la marca de agua absoluta. */}
      <div className={`${pinned ? "sticky top-0 h-dvh" : "relative"} flex flex-col justify-center overflow-hidden py-20`}>
        <p
          aria-hidden
          className="display pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[22vw] leading-none whitespace-nowrap text-white/[0.04] select-none"
        >
          {watermark}
        </p>

        <div
          ref={track}
          className={`relative flex items-stretch gap-6 px-4 will-change-transform sm:px-6 lg:gap-8 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] ${pinned ? "w-max" : "no-scrollbar snap-x snap-mandatory scroll-px-4 overflow-x-auto sm:scroll-px-6 lg:scroll-px-[max(2rem,calc((100vw-80rem)/2+2rem))]"}`}
        >
          <div className="flex w-[80vw] shrink-0 snap-start flex-col justify-center sm:w-[26rem]">
            <h2 className="display text-5xl sm:text-6xl lg:text-7xl">{title}</h2>
            <div className="mt-10">{cta}</div>
          </div>

          {cards.map((c, i) => (
            <article
              key={c.title}
              className="group relative isolate flex h-[min(34rem,68dvh)] w-[78vw] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-[1.75rem] ring-1 ring-white/10 sm:w-[22rem] lg:w-[24rem]"
              style={{ marginTop: i % 2 ? "2.5rem" : 0 }}
            >
              <div data-parallax className="absolute inset-0 -z-10 scale-[1.12] will-change-transform">
                <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 26rem, 80vw" className="object-cover" />
              </div>
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0d2a1f] via-[#0d2a1f]/55 to-transparent" />
              <div className="p-6 sm:p-7">
                <p className="font-ui text-xs font-medium tracking-[0.18em] text-agua uppercase">{c.tag}</p>
                <h3 className="display mt-2 text-3xl">{c.title}</h3>
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
