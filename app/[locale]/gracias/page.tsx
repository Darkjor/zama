import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight, CheckCircle } from "@phosphor-icons/react/ssr";
import { Link } from "@/i18n/navigation";
import { ConversionEvent } from "@/components/ConversionEvent";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

const TIPOS = ["cotizacion", "broker", "brochure"] as const;
type Tipo = (typeof TIPOS)[number];

export async function generateMetadata({ params }: PageProps<"/[locale]/gracias">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gracias" });
  // Página de confirmación: no debe aparecer en buscadores.
  return { title: `${t("metaTitle")} | ${site.name}`, robots: { index: false, follow: false } };
}

export default async function GraciasPage({ params, searchParams }: PageProps<"/[locale]/gracias">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gracias");
  const tw = await getTranslations("whatsapp");
  const raw = (await searchParams).tipo;
  const tipo: Tipo = TIPOS.includes(raw as Tipo) ? (raw as Tipo) : "cotizacion";
  const brochure = tipo === "brochure";

  return (
    <section className="relative isolate flex min-h-[calc(100dvh-4.5rem)] items-center overflow-hidden bg-tinta text-white">
      <ConversionEvent tipo={tipo} />
      <Image src="/img/sendero.webp" alt="" fill priority sizes="100vw" className="-z-10 object-cover object-[50%_60%]" />
      <div className="absolute inset-0 -z-10 bg-black/60" />

      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6">
        <CheckCircle weight="light" className="hero-in mx-auto size-16 text-arena" aria-hidden />
        <h1 className="hero-in display mt-8 text-4xl sm:text-5xl lg:text-6xl" style={{ animationDelay: "120ms" }}>
          {t("title")}
        </h1>
        <p className="hero-in mx-auto mt-6 max-w-[56ch] text-lg leading-relaxed text-white/85" style={{ animationDelay: "240ms" }}>
          {t(tipo)}
        </p>

        <div className="hero-in mt-12" style={{ animationDelay: "360ms" }}>
          <p className="font-ui text-sm text-white/70">{t("siguiente")}</p>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {/* En brochure, abrir el Drive es la acción principal; en los demás, WhatsApp. */}
            <a
              href={site.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-ui inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium tracking-wide whitespace-nowrap transition-[background-color,transform] duration-200 active:scale-[0.98] ${
                brochure ? "order-first bg-crema text-caoba hover:bg-white" : "border border-white/60 text-white hover:bg-white/10"
              }`}
            >
              {t("drive")}
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
            <a
              href={whatsappLink(tw("general"))}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-ui inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-medium tracking-wide whitespace-nowrap transition-[background-color,transform] duration-200 active:scale-[0.98] ${
                brochure ? "border border-white/60 text-white hover:bg-white/10" : "order-first bg-crema text-caoba hover:bg-white"
              }`}
            >
              <WhatsAppIcon className="size-4" />
              {t("whatsapp")}
            </a>
          </div>
          <Link href="/" className="font-ui mt-8 inline-flex text-sm text-white/80 underline underline-offset-4 hover:text-white">
            {t("inicio")}
          </Link>
        </div>
      </div>
    </section>
  );
}
