import Image from "next/image";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/LeadForm";
import { Gallery } from "@/components/Gallery";
import { HorizontalScroll } from "@/components/HorizontalScroll";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import { disponibilidad, pricePerM2, site, tipologias, ubicacion, type Tipologia } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { formatDate, formatMXN, formatNumber } from "@/lib/format";
import { SITE_URL } from "@/lib/seo";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd locale={locale} />
      <Hero />
      <Intro />
      <Vivir />
      <Destino />
      <Galeria />
      <Amenidades />
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
      className={`font-ui inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-medium tracking-wide transition-colors ${tones[tone]} ${className}`}
    >
      <WhatsAppIcon className="size-4" />
      {children}
    </a>
  );
}

function SectionHead({ eyebrow, title, tone = "dark", className = "" }: { eyebrow: string; title: ReactNode; tone?: "dark" | "light"; className?: string }) {
  return (
    <div className={`reveal ${className}`}>
      <p className={`eyebrow ${tone === "dark" ? "text-terracota" : "text-arena"}`}>{eyebrow}</p>
      <h2 className={`display mt-4 text-4xl sm:text-5xl lg:text-6xl ${tone === "dark" ? "text-tinta" : "text-white"}`}>{title}</h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */

async function Hero() {
  const t = await getTranslations("hero");
  const tw = await getTranslations("whatsapp");
  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-tinta">
      <Image src="/img/laguna.webp" alt="" fill priority sizes="100vw" className="slow-zoom -z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-black/40 to-transparent" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-16 pb-14 sm:px-6 lg:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:px-8 lg:py-20">
        <div className="text-white">
          <p className="hero-in eyebrow inline-block rounded-full border border-white/40 px-4 py-2 text-white/90 backdrop-blur-sm">{t("eyebrow")}</p>
          <h1 className="hero-in display mt-7 text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem]" style={{ animationDelay: "120ms" }}>
            {t("title")} <em className="block text-arena">{t("titleEm")}</em>
          </h1>
          <p className="hero-in mt-7 max-w-xl text-lg leading-relaxed text-white/85" style={{ animationDelay: "240ms" }}>
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
  const tw = await getTranslations("whatsapp");
  return (
    <section id="nosotros" className="bg-paper">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-32">
        <div className="reveal relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] shadow-2xl shadow-caoba/20 lg:max-w-none">
          <Image src="/img/fachada-logo.webp" alt={site.name} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
        </div>
        <div className="reveal">
          <Image src="/brand/iso-cafe.svg" alt="" width={371} height={367} className="size-14" />
          <p className="eyebrow mt-8 text-terracota">{t("eyebrow")}</p>
          <h2 className="display mt-4 text-4xl text-tinta sm:text-5xl">{t("title")}</h2>
          <p className="mt-7 text-lg leading-relaxed text-tinta-soft">{t("body1")}</p>
          <p className="mt-4 text-lg leading-relaxed text-tinta-soft">{t("body2")}</p>
          <p className="font-ui mt-8 text-sm text-tinta-soft">
            {t("by")} <strong className="font-medium text-caoba">{site.developer}</strong>
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WaButton text={tw("presentacion")} tone="dark">
              {t("ctaWhatsapp")}
            </WaButton>
            <a
              href={site.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-ui inline-flex items-center justify-center gap-2 rounded-full border border-caoba px-6 py-3.5 text-sm font-medium tracking-wide text-caoba transition-colors hover:bg-caoba hover:text-white"
            >
              {t("ctaDrive")}
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>
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
  const cards = images.map((image, i) => {
    const n = i + 1;
    return {
      image,
      tag: t(`c${n}Tag` as "c1Tag"),
      title: t(`c${n}Title` as "c1Title"),
      body: t(`c${n}Body` as "c1Body"),
    };
  });
  return (
    <HorizontalScroll
      eyebrow={t("eyebrow")}
      title={t("title")}
      hint={t("hint")}
      watermark={site.name}
      cards={cards}
      cta={<WaButton text={tw("general")}>{t("cta")}</WaButton>}
    />
  );
}

async function Destino() {
  const t = await getTranslations("destino");
  const points = [
    { icon: "M3 17c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0M3 12c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0", text: t("laguna", { metros: ubicacion.lagunaMetros }) },
    { icon: "M5 17h14M6 17l1.5-6h9L18 17M8 11l1-4h6l1 4M7.5 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM16.5 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3z", text: t("carretera", { metros: ubicacion.carreteraMetros }) },
    { icon: "M12 21c-4-3-7-6-7-10a7 7 0 0114 0c0 4-3 7-7 10zM12 13a2 2 0 100-4 2 2 0 000 4z", text: t("biosfera") },
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
                  <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={p.icon} />
                  </svg>
                </span>
                <span className="font-ui text-base text-tinta">{p.text}</span>
              </li>
            ))}
          </ul>
          <a href={ubicacion.mapsUrl} target="_blank" rel="noopener noreferrer" className="font-ui mt-10 inline-flex text-sm font-medium text-caoba underline underline-offset-4 hover:text-caoba-deep">
            {t("mapsCta")}
          </a>
        </div>
        <div className="reveal relative mx-auto aspect-[1010/1262] w-full max-w-lg overflow-hidden rounded-[2rem] shadow-2xl shadow-caoba/20">
          <Image src="/img/mapa.webp" alt={t("mapAlt")} fill sizes="(min-width: 1024px) 36rem, 92vw" className="object-cover" />
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
        <SectionHead eyebrow={t("eyebrow")} title={<span id="galeria-title">{t("title")}</span>} />
      </div>
      <Gallery items={items} prev={t("prev")} next={t("next")} />
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
          <p className="eyebrow text-arena">{t("eyebrow")}</p>
          <h2 id="amenidades-title" className="display mt-4 text-5xl sm:text-6xl">
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
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} className="text-center" />

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
                    <svg viewBox="0 0 24 24" className="size-7 text-arena" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
                      <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" />
                      <path d="M9 12l2 2 4-4.5" />
                    </svg>
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
            ].map((c) => (
              <article key={c.title} className="reveal relative isolate flex min-h-[22rem] overflow-hidden rounded-[1.75rem] bg-tinta text-white">
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

  return (
    <section id="tipologias" className="bg-crema">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tipologias.map((tp) => {
            const { name, body } = names[tp.id];
            return (
              <article key={tp.id} className="reveal group flex flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-xl shadow-caoba/10">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={tp.image} alt={name} fill sizes="(min-width: 1024px) 26rem, (min-width: 768px) 50vw, 92vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                  <span className="font-ui absolute top-4 left-4 rounded-full bg-crema/95 px-3.5 py-1.5 text-xs font-medium text-caoba">
                    {formatNumber(tp.area, locale)} m²
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="display text-3xl text-tinta">{name}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-tinta-soft">{body}</p>
                  <dl className="font-ui mt-6 grid gap-2 border-t border-arena pt-5 text-sm">
                    {tp.frente && tp.fondo ? (
                      <div className="flex justify-between gap-4">
                        <dt className="text-tinta-soft">{t("terreno")}</dt>
                        <dd className="text-tinta">
                          {formatNumber(tp.area, locale)} m² · {t("medidas", { frente: formatNumber(tp.frente, locale), fondo: formatNumber(tp.fondo, locale) })}
                        </dd>
                      </div>
                    ) : null}
                    {tp.plantas ? (
                      <div className="flex justify-between gap-4">
                        <dt className="text-tinta-soft">{t("construccion")}</dt>
                        <dd className="text-right text-tinta">{t("plantas", { baja: tp.plantas.baja, alta: tp.plantas.alta })}</dd>
                      </div>
                    ) : null}
                  </dl>
                  <div className="mt-6">
                    <p className="eyebrow text-terracota">{t("desde")}</p>
                    <p className="font-ui mt-1 text-3xl font-medium text-caoba">
                      {formatMXN(tp.priceFrom, locale)} <span className="text-base font-light text-tinta-soft">MXN</span>
                    </p>
                    {tp.frente ? <p className="mt-1 text-sm text-tinta-soft">{t("perM2", { precio: formatMXN(pricePerM2, locale) })}</p> : null}
                  </div>
                  <WaButton text={tw("tipologia", { nombre: name })} tone="dark" className="mt-6 w-full">
                    {t("cotizar")}
                  </WaButton>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-6 text-xs text-tinta-soft/70">{t("note")}</p>
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
  return (
    <section id="disponibilidad" className="bg-selva text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:px-8 lg:py-32">
        <div>
          <SectionHead eyebrow={t("eyebrow")} title={t("title")} tone="light" />
          <p className="reveal mt-6 max-w-lg text-lg leading-relaxed text-white/80">{t("body")}</p>
          <dl className="reveal mt-10 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className={`rounded-2xl p-5 ${s.highlight ? "bg-agua text-selva" : "bg-white/8 ring-1 ring-white/15"}`}>
                <dd className="font-ui text-4xl font-light sm:text-5xl">{s.value}</dd>
                <dt className={`font-ui mt-2 text-xs tracking-wide sm:text-sm ${s.highlight ? "text-selva/80" : "text-white/70"}`}>{s.label}</dt>
              </div>
            ))}
          </dl>
          <p className="font-ui mt-4 text-xs text-white/55">{t("actualizado", { fecha: formatDate(disponibilidad.fecha, locale) })}</p>
          <WaButton text={tw("disponibilidad")} className="mt-9">
            {t("cta")}
          </WaButton>
        </div>
        <div className="reveal relative aspect-[16/11] overflow-hidden rounded-[1.75rem] ring-1 ring-white/10">
          <Image src="/img/lotes-aereo.webp" alt={t("alt")} fill sizes="(min-width: 1024px) 42rem, 92vw" className="object-cover" />
          <span className="font-ui absolute top-5 right-5 rounded-full bg-crema px-4 py-2 text-xs font-medium tracking-wide text-caoba">{t("fase2")}</span>
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
          <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
          <p className="reveal mt-6 max-w-lg text-lg leading-relaxed text-tinta-soft">{t("body")}</p>
          <LeadForm variant="broker" className="reveal mt-10 max-w-lg" />
        </div>
        <div className="reveal relative hidden aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl shadow-caoba/20 lg:block">
          <Image src="/img/muelle.webp" alt={t("alt")} fill sizes="40vw" className="object-cover" />
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
