"use client";
// "use client": los botones anterior/siguiente desplazan el carrusel con
// scrollBy; el deslizamiento táctil funciona solo con scroll-snap.

import { useRef } from "react";
import Image from "next/image";

type Item = { src: string; caption: string };

export function Gallery({ items, prev, next }: { items: Item[]; prev: string; next: string }) {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 400) + 20), behavior: "smooth" });
  };

  return (
    <div>
      <ul
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-2 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        {items.map((item, i) => (
          <li key={item.src} className="group relative w-[82vw] shrink-0 snap-start overflow-hidden rounded-2xl sm:w-[60vw] lg:w-[46rem]">
            <div className="relative aspect-[16/10]">
              <Image
                src={item.src}
                alt={item.caption}
                fill
                sizes="(min-width: 1024px) 46rem, (min-width: 640px) 60vw, 82vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                loading={i < 2 ? "eager" : "lazy"}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-16">
                <p className="display text-2xl text-white italic">{item.caption}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-6 flex max-w-7xl justify-end gap-3 px-4 sm:px-6 lg:px-8">
        {[
          { dir: -1 as const, label: prev, d: "M15 5l-7 7 7 7" },
          { dir: 1 as const, label: next, d: "M9 5l7 7-7 7" },
        ].map((b) => (
          <button
            key={b.dir}
            type="button"
            onClick={() => scroll(b.dir)}
            aria-label={b.label}
            className="inline-flex size-12 items-center justify-center rounded-full border border-caoba/40 text-caoba transition-colors hover:bg-caoba hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d={b.d} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
