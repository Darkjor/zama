"use client";
// "use client": el menú móvil necesita estado (abierto/cerrado), cerrar con
// Escape y bloquear el scroll del body mientras está abierto.

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

const SECTIONS = ["destino", "inversion", "tipologias", "disponibilidad", "brokers"] as const;

export function Header() {
  const t = useTranslations("nav");
  const tw = useTranslations("whatsapp");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const home = locale === "en" ? "/en" : "/";
  const otherLocale = locale === "en" ? "es" : "en";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: `${home}#inicio`, label: t("inicio") },
    ...SECTIONS.map((id) => ({ href: `${home}#${id}`, label: t(id) })),
  ];

  return (
    <header className="sticky top-0 z-40 bg-caoba text-white shadow-[0_1px_0_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-[4.5rem] lg:px-8">
        <a href={`${home}#inicio`} className="flex shrink-0 items-center" aria-label={site.name}>
          <Image src="/brand/logo-blanco.svg" alt={site.name} width={983} height={805} priority className="h-12 w-auto lg:h-14" />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="font-ui text-sm font-light tracking-wide text-white/85 transition-colors hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={pathname}
            locale={otherLocale}
            className="font-ui rounded-full px-2.5 py-1.5 text-xs font-medium tracking-widest text-white/80 transition-colors hover:text-white"
            aria-label={t("language")}
          >
            {t("languageShort")}
          </Link>
          <a
            href={whatsappLink(tw("general"))}
            target="_blank"
            rel="noopener noreferrer"
            className="font-ui hidden rounded-full bg-crema px-5 py-2.5 text-sm font-medium text-caoba transition-colors hover:bg-white sm:inline-flex"
          >
            {t("cta")}
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-full lg:hidden"
            aria-label={t("menu")}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`fixed inset-0 z-50 flex flex-col bg-caoba-deep transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Image src="/brand/logo-blanco.svg" alt="" width={983} height={805} className="h-12 w-auto" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-full"
            aria-label={t("close")}
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <nav aria-label="Móvil" className="flex flex-1 flex-col justify-center gap-2 px-8">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="display py-2 text-4xl text-white transition-all duration-500"
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms", transform: open ? "none" : "translateY(12px)", opacity: open ? 1 : 0 }}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="px-8 pb-10">
          <a
            href={whatsappLink(tw("general"))}
            target="_blank"
            rel="noopener noreferrer"
            className="font-ui flex w-full items-center justify-center rounded-full bg-crema px-6 py-4 font-medium text-caoba"
          >
            {t("cta")}
          </a>
        </div>
      </div>
    </header>
  );
}
