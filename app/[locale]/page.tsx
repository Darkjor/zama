import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/LeadForm";
import { Gallery } from "@/components/Gallery";
import { HorizontalScroll } from "@/components/HorizontalScroll";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import { LotPlan } from "@/components/LotPlan";
import { ArrowUpRight, Car, ShieldCheck, Tree, Waves } from "@phosphor-icons/react/ssr";
import { disponibilidad, mostrarAmenidades, pricePerM2, site, tipologias, ubicacion, type Tipologia } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { formatDate, formatMXN, formatMXNCompact, formatNumber } from "@/lib/format";
import { SITE_URL } from "@/lib/seo";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd locale={locale} />
      <Hero locale={locale} />
      <Intro />
      <Vivir />
      <Destino />
      <Galeria />
      {mostrarAmenidades && <Amenidades />}
      <Inversion />
      <Tipologias locale={locale} />
      <Disponibilidad locale={locale} />
      <Brokers />
      <CtaFinal />
    </>
  );
}

/* ------------------------------------------------------------------ */

function WaButton({ text, children, tone = "light", className = "" }: { text: string; children: ReactNode; tone?: "light" | "dark" | "outline"; className?: string }) {
  const tones = {
    light: "bg-crema text-caoba hover:bg-white",
    dark: "bg-caoba text-white hover:bg-caoba-deep",
    outline: "border border-current hover:bg-white/10",
  };
  return (
    <a
      href={whatsappLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-ui inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-medium tracking-wide whitespace-nowrap transition-[background-color,transform] duration-200 active:scale-[0.98] ${tones[tone]} ${className}`}
    >
      <WhatsAppIcon className="size-4" />
      {children}
    </a>
  );
}

// Etiqueta pequeña sobre el título: máximo 4 en la página (hero, Destino,
// Tipologías y cierre) para no caer en el ritmo repetitivo de plantilla.
function SectionHead({ eyebrow, title, tone = "dark", className = "" }: { eyebrow?: string; title: ReactNode; tone?: "dark" | "light"; className?: string }) {
  return (
    <div className={`reveal ${className}`}>
      {eyebrow && <p className={`eyebrow mb-4 ${tone === "dark" ? "text-terracota" : "text-arena"}`}>{eyebrow}</p>}
      <h2 className={`display text-4xl sm:text-5xl lg:text-6xl ${tone === "dark" ? "text-tinta" : "text-white"}`}>{title}</h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */

async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations("hero");
  const tw = await getTranslations("whatsapp");
  const precioEntrada = Math.min(...tipologias.filter((tp) => tp.id !== "villa").map((tp) => tp.priceFrom));
  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-tinta">
      <Image src="/img/laguna.webp" alt="" fill priority sizes="100vw" className="slow-zoom -z-10 object-cover" />
      {/* Video de Mexo (el mismo del hero de Fuerza Migrante), alojado en
          /public. La foto de la laguna queda debajo como póster y respaldo si
          el video no carga o la persona prefiere menos movimiento. */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/img/laguna.webp"
        aria-hidden
        className="absolute inset-0 -z-10 size-full object-cover motion-reduce:hidden"
      >
        <source src="/video/hero.webm" type="video/webm" />
      </video>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-black/40 to-transparent" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-16 pb-14 sm:px-6 lg:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:px-8 lg:py-20">
        <div className="text-white">
          <p className="hero-in eyebrow inline-block rounded-full border border-white/40 px-4 py-2 text-white/90 backdrop-blur-sm">{t("eyebrow")}</p>
          <h1 className="hero-in display mt-7 text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem]" style={{ animationDelay: "120ms" }}>
            {t("title")} <em className="block text-arena">{t("titleEm")}</em>
          </h1>
          {/* Precio de entrada visible desde el primer pantallazo: quien deja
              sus datos ya sabe el rango, lo que filtra leads fuera de presupuesto. */}
          <p className="hero-in font-ui mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1" style={{ animationDelay: "180ms" }}>
            <span className="eyebrow text-arena">{t("precioDesde")}</span>
            <span className="text-4xl font-medium tracking-tight sm:text-5xl">{formatMXNCompact(precioEntrada, locale)}</span>
            <span className="text-sm font-light text-white/75">{t("precioMxn")}</span>
          </p>
          <p className="hero-in mt-6 max-w-xl text-lg leading-relaxed text-white/85" style={{ animationDelay: "240ms" }}>
            {t("body")}
          </p>
          <div className="hero-in mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "360ms" }}>
            <WaButton text={tw("general")}>{t("ctaAsesor")}</WaButton>
            <a href="#tipologias" className="font-ui inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-3.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-white/10">
              {t("ctaTipologias")}
            </a>
          </div>
        </div>
        <div className="hero-in w-full max-w-md justify-self-center lg:justify-self-end" style={{ animationDelay: "300ms" }} id="cotiza">
          <LeadForm variant="cotizacion" className="border border-white/10 bg-caoba/90 backdrop-blur-md" />
        </div>
      </div>
    </section>
  );
}

async function Intro() {
  const t = await getTranslations("intro");
  return (
    <section id="nosotros" className="bg-paper">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-32">
        <div className="reveal relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[1.75rem] shadow-2xl shadow-caoba/20 lg:max-w-none">
          <Image src="/img/fachada-logo.webp" alt={site.name} fill sizes="(min-width: 1024px) 40vw, 90vw" className="reveal-zoom object-cover" />
        </div>
        <div className="reveal">
          <Image src="/brand/iso-cafe.svg" alt="" width={371} height={367} className="size-14" />
          <h2 className="display mt-8 text-4xl text-tinta sm:text-5xl">{t("title")}</h2>
          <p className="mt-7 max-w-[62ch] text-lg leading-relaxed text-tinta-soft">{t("body1")}</p>
          <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-tinta-soft">{t("body2")}</p>
          <p className="font-ui mt-8 text-sm text-tinta-soft">
            {t("by")} <strong className="font-medium text-caoba">{site.developer}</strong>
          </p>
          <a
            href={site.driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-ui mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-caoba px-6 py-3.5 text-sm font-medium tracking-wide text-caoba transition-colors hover:bg-caoba hover:text-white active:scale-[0.98]"
          >
            {t("ctaDrive")}
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}

// Alternativa a la Galería inspirada en mantustulum.com (scroll horizontal
// fijado). Ambas quedan en la página para que el cliente elija una.
async function Vivir() {
  const t = await getTranslations("vivir");
  const tw = await getTranslations("whatsapp");
  const images = ["/img/laguna.webp", "/img/amanecer.webp", "/img/villa-fachada.webp", "/img/casa-club.webp", "/img/interior.webp", "/img/sendero.webp"];
  const cards = images
    .map((image, i) => {
      const n = i + 1;
      return {
        n,
        image,
        tag: t(`c${n}Tag` as "c1Tag"),
        title: t(`c${n}Title` as "c1Title"),
        body: t(`c${n}Body` as "c1Body"),
      };
    })
    // La tarjeta 4 es "Casa Club + 11 amenidades".
    .filter((c) => mostrarAmenidades || c.n !== 4);
  return (
    <HorizontalScroll
      title={t("title")}
      watermark={site.name}
      cards={cards}
      cta={<WaButton text={tw("general")}>{t("cta")}</WaButton>}
    />
  );
}

async function Destino() {
  const t = await getTranslations("destino");
  const points = [
    { Icon: Waves, text: t("laguna", { metros: ubicacion.lagunaMetros }) },
    { Icon: Car, text: t("carretera", { metros: ubicacion.carreteraMetros }) },
    { Icon: Tree, text: t("biosfera") },
  ];
  return (
    <section id="destino" className="bg-crema">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-20 lg:px-8 lg:py-32">
        <div>
          <SectionHead
            eyebrow={t("eyebrow")}
            title={
              <>
                {t("title")} <em className="text-caoba">{t("titleEm")}</em>
              </>
            }
          />
          <p className="reveal mt-7 text-lg leading-relaxed text-tinta-soft">{t("body")}</p>
          <ul className="reveal mt-10 grid gap-5">
            {points.map((p) => (
              <li key={p.text} className="flex items-center gap-4">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-caoba text-arena">
                  <p.Icon weight="light" className="size-6" aria-hidden />
                </span>
                <span className="font-ui text-base text-tinta">{p.text}</span>
              </li>
            ))}
          </ul>
          <a href={ubicacion.mapsUrl} target="_blank" rel="noopener noreferrer" className="font-ui mt-10 inline-flex text-sm font-medium text-caoba underline underline-offset-4 hover:text-caoba-deep">
            {t("mapsCta")}
          </a>
        </div>
        <div className="reveal relative mx-auto aspect-[1010/1262] w-full max-w-lg overflow-hidden rounded-[1.75rem] shadow-2xl shadow-caoba/20">
          <Image src="/img/mapa.webp" alt={t("mapAlt")} fill sizes="(min-width: 1024px) 36rem, 92vw" className="reveal-zoom object-cover" />
        </div>
      </div>
    </section>
  );
}

async function Galeria() {
  const t = await getTranslations("galeria");
  const items = [
    { src: "/img/amanecer.webp", caption: t("g1") },
    { src: "/img/villa-atardecer.webp", caption: t("g2") },
    { src: "/img/villa-fachada.webp", caption: t("g3") },
    { src: "/img/villa-acceso.webp", caption: t("g4") },
    { src: "/img/villa-lateral.webp", caption: t("g5") },
    { src: "/img/villa-planos.webp", caption: t("g6") },
  ];
  return (
    <section className="bg-crema pb-24 lg:pb-32" aria-labelledby="galeria-title">
      <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead title={<span id="galeria-title">{t("title")}</span>} />
      </div>
      <div className="reveal">
        <Gallery items={items} prev={t("prev")} next={t("next")} />
      </div>
      <p className="mx-auto mt-4 max-w-7xl px-4 text-xs text-tinta-soft/70 sm:px-6 lg:px-8">{t("disclaimer")}</p>
    </section>
  );
}

async function Amenidades() {
  const t = await getTranslations("amenidades");
  const tw = await getTranslations("whatsapp");
  return (
    <section className="relative isolate overflow-hidden bg-tinta" aria-labelledby="amenidades-title">
      <Image src="/img/casa-club.webp" alt={t("alt")} fill sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/35 to-black/10 lg:bg-gradient-to-r lg:from-transparent lg:via-black/30 lg:to-black/75" />
      <div className="mx-auto flex min-h-[40rem] max-w-7xl items-end px-4 py-20 sm:px-6 lg:min-h-[46rem] lg:items-center lg:justify-end lg:px-8">
        <div className="reveal max-w-lg text-white">
          <h2 id="amenidades-title" className="display text-5xl sm:text-6xl">
            {t("title")} <em className="block text-arena">{t("titleEm")}</em>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/85">{t("body")}</p>
          <WaButton text={tw("amenidades")} className="mt-8">
            {t("cta")}
          </WaButton>
        </div>
      </div>
    </section>
  );
}

async function Inversion() {
  const t = await getTranslations("inversion");
  const tw = await getTranslations("whatsapp");
  return (
    <section id="inversion" className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <SectionHead title={t("title")} className="text-center" />

        <div className="mt-14 grid gap-5">
          <article className="reveal relative isolate overflow-hidden rounded-[1.75rem] bg-tinta text-white">
            <Image src="/img/interior.webp" alt="" fill sizes="(min-width: 1280px) 80rem, 100vw" className="-z-10 object-cover opacity-55" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
            <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:p-14">
              <div>
                <h3 className="display text-4xl text-arena sm:text-5xl">{t("certezaTitle")}</h3>
                <p className="mt-4 max-w-md text-lg text-white/85">{t("certezaBody")}</p>
                <WaButton text={tw("legal")} className="mt-8">
                  {t("certezaCta")}
                </WaButton>
              </div>
              <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {[t("certeza1"), t("certeza2"), t("certeza3")].map((item) => (
                  <li key={item} className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
                    <ShieldCheck weight="light" className="size-7 text-arena max-lg:mx-auto" aria-hidden />
                    <p className="font-ui mt-3 text-sm leading-snug text-white">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              { title: t("sustentableTitle"), body: t("sustentableBody"), img: "/img/villa-lateral.webp" },
              { title: t("respaldoTitle"), body: t("respaldoBody"), img: "/img/lifestyle.webp" },
            ].map((c, i) => (
              <article key={c.title} style={{ "--reveal-delay": `${i * 140}ms` } as CSSProperties} className="reveal relative isolate flex min-h-[22rem] overflow-hidden rounded-[1.75rem] bg-tinta text-white">
                <Image src={c.img} alt="" fill sizes="(min-width: 768px) 40rem, 100vw" className="-z-10 object-cover" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/5" />
                <div className="mt-auto p-8 sm:p-10">
                  <h3 className="display text-3xl text-arena sm:text-4xl">{c.title}</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-white/85">{c.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

async function Tipologias({ locale }: { locale: string }) {
  const t = await getTranslations("tipologias");
  const tw = await getTranslations("whatsapp");
  const names: Record<Tipologia["id"], { name: string; body: string }> = {
    "lote-a": { name: t("loteAName"), body: t("loteABody") },
    "lote-b": { name: t("loteBName"), body: t("loteBBody") },
    villa: { name: t("villaName"), body: t("villaBody") },
  };
  const lotes = tipologias.filter((tp) => tp.frente && tp.fondo);
  const villa = tipologias.find((tp) => tp.plantas);
  const maxFondo = Math.max(...lotes.map((l) => l.fondo!));

  return (
    <section id="tipologias" className="bg-crema">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          {/* Lotes: la planta a escala deja ver la diferencia de frente. */}
          <div className="grid gap-6">
            {lotes.map((tp, i) => {
              const { name, body } = names[tp.id];
              const medidas = t("medidas", { frente: formatNumber(tp.frente!, locale), fondo: formatNumber(tp.fondo!, locale) });
              return (
                <article
                  key={tp.id}
                  style={{ "--reveal-delay": `${i * 140}ms` } as CSSProperties}
                  className="reveal flex flex-col gap-7 rounded-[1.75rem] bg-white p-6 shadow-xl shadow-caoba/[0.07] ring-1 ring-arena/70 sm:flex-row sm:items-center sm:p-8"
                >
                  <div className="flex justify-center sm:w-32">
                    <LotPlan frente={tp.frente!} fondo={tp.fondo!} maxFondo={maxFondo} locale={locale} label={`${name}: ${medidas}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="display text-3xl text-tinta">{name}</h3>
                      <p className="font-ui text-sm font-medium text-caoba">{formatNumber(tp.area, locale)} m²</p>
                    </div>
                    <p className="mt-2 max-w-[48ch] leading-relaxed text-tinta-soft">{body}</p>
                    <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-arena pt-5">
                      <div>
                        <p className="font-ui text-xs text-tinta-soft">{t("desde")}</p>
                        <p className="font-ui text-2xl font-medium text-caoba tabular-nums sm:text-3xl">
                          {formatMXN(tp.priceFrom, locale)} <span className="text-sm font-light text-tinta-soft">MXN</span>
                        </p>
                        <p className="font-ui mt-0.5 text-xs text-tinta-soft">{t("perM2", { precio: formatMXN(pricePerM2, locale) })}</p>
                      </div>
                      <WaButton text={tw("tipologia", { nombre: name })} tone="dark" className="!px-5 !py-3">
                        {t("cotizar")}
                      </WaButton>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Villa: pieza protagonista, con foto y construcción por planta. */}
          {villa?.plantas && (
            <article
              style={{ "--reveal-delay": "280ms" } as CSSProperties}
              className="reveal relative isolate flex min-h-[34rem] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-tinta text-white"
            >
              <Image src={villa.image} alt={names.villa.name} fill sizes="(min-width: 1024px) 38rem, 92vw" className="reveal-zoom -z-10 object-cover" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/45 to-black/0" />
              <div className="p-7 sm:p-10">
                <h3 className="display text-4xl sm:text-5xl">{names.villa.name}</h3>
                <p className="mt-3 max-w-[46ch] leading-relaxed text-white/85">{names.villa.body}</p>
                <dl className="font-ui mt-7 grid max-w-sm grid-cols-2 gap-6 border-t border-white/20 pt-5">
                  <div>
                    <dt className="text-xs text-white/75">{t("plantaBaja")}</dt>
                    <dd className="mt-1 text-3xl font-light tabular-nums">{villa.plantas.baja} m²</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-white/75">{t("plantaAlta")}</dt>
                    <dd className="mt-1 text-3xl font-light tabular-nums">{villa.plantas.alta} m²</dd>
                  </div>
                </dl>
                <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="font-ui text-xs text-white/75">{t("desde")}</p>
                    <p className="font-ui text-3xl font-medium tabular-nums">
                      {formatMXN(villa.priceFrom, locale)} <span className="text-sm font-light text-white/75">MXN</span>
                    </p>
                  </div>
                  <WaButton text={tw("tipologia", { nombre: names.villa.name })}>{t("cotizar")}</WaButton>
                </div>
              </div>
            </article>
          )}
        </div>
        <p className="mt-6 text-xs text-tinta-soft">{t("note")}</p>
      </div>
    </section>
  );
}

async function Disponibilidad({ locale }: { locale: string }) {
  const t = await getTranslations("disponibilidad");
  const tw = await getTranslations("whatsapp");
  const stats = [
    { value: disponibilidad.totales, label: t("totales") },
    { value: disponibilidad.vendidos, label: t("vendidos") },
    { value: disponibilidad.disponibles, label: t("disponibles"), highlight: true },
  ];
  // Foto aérea de los lotes a sangre completa: la sección se lee como "esto
  // es lo que queda", sin repetir el esquema texto + foto de otras secciones.
  return (
    <section id="disponibilidad" className="reveal relative isolate overflow-hidden bg-selva text-white">
      <Image src="/img/lotes-aereo.webp" alt={t("alt")} fill sizes="100vw" className="reveal-zoom -z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-selva via-selva/85 to-selva/40 lg:bg-gradient-to-r lg:from-selva lg:via-selva/85 lg:to-selva/20" />
      <div className="mx-auto flex min-h-[44rem] max-w-7xl items-end px-4 py-24 sm:px-6 lg:items-center lg:px-8 lg:py-32">
        <div className="max-w-xl">
          <h2 className="display text-4xl sm:text-5xl lg:text-6xl">{t("title")}</h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-white/85">{t("body")}</p>
          <dl className="font-ui mt-10 grid grid-cols-3 divide-x divide-white/20">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse px-4 first:pl-0">
                <dt className="mt-2 text-sm text-white/80">{s.label}</dt>
                <dd className={`text-5xl font-light tabular-nums sm:text-6xl ${s.highlight ? "text-agua" : ""}`}>{s.value}</dd>
              </div>
            ))}
          </dl>
          <p className="font-ui mt-6 text-xs text-white/75">
            {t("actualizado", { fecha: formatDate(disponibilidad.fecha, locale) })}. {t("fase2")}.
          </p>
          <WaButton text={tw("disponibilidad")} className="mt-9">
            {t("cta")}
          </WaButton>
        </div>
      </div>
    </section>
  );
}

async function Brokers() {
  const t = await getTranslations("brokers");
  return (
    <section id="brokers" className="bg-paper">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-32">
        <div>
          <SectionHead title={t("title")} />
          <p className="reveal mt-6 max-w-lg text-lg leading-relaxed text-tinta-soft">{t("body")}</p>
          <LeadForm variant="broker" className="reveal mt-10 max-w-lg" />
        </div>
        <div className="reveal relative hidden aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-2xl shadow-caoba/20 lg:block">
          <Image src="/img/muelle.webp" alt={t("alt")} fill sizes="40vw" className="reveal-zoom object-cover" />
        </div>
      </div>
    </section>
  );
}

async function CtaFinal() {
  const t = await getTranslations("cta");
  const tw = await getTranslations("whatsapp");
  return (
    <section className="relative isolate overflow-hidden bg-tinta text-white">
      <Image src="/img/sendero.webp" alt="" fill sizes="100vw" className="-z-10 object-cover object-[50%_60%]" />
      <div className="absolute inset-0 -z-10 bg-black/55" />
      <div className="reveal mx-auto flex max-w-4xl flex-col items-center px-4 py-28 text-center sm:px-6 lg:py-36">
        <Image src="/brand/iso-blanco.svg" alt="" width={371} height={367} className="size-14" />
        <p className="eyebrow mt-8 text-arena">{t("eyebrow")}</p>
        <h2 className="display mt-5 text-4xl sm:text-5xl lg:text-6xl">
          <em>{t("title")}</em>
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">{t("body")}</p>
        <WaButton text={tw("presentacion")} className="mt-10">
          {t("button")}
        </WaButton>
      </div>
    </section>
  );
}

async function JsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "meta" });
  const data = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: site.name,
    description: t("description"),
    url: locale === "en" ? `${SITE_URL}/en` : SITE_URL,
    image: `${SITE_URL}/og.jpg`,
    address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: site.state, addressCountry: "MX" },
    telephone: `+${site.whatsapp}`,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
