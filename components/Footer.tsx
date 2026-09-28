import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

const SECTIONS = ["destino", "inversion", "tipologias", "disponibilidad", "brokers", "faq"] as const;

export async function Footer() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const tw = await getTranslations("whatsapp");
  const locale = await getLocale();
  const home = locale === "en" ? "/en" : "/";

  return (
    <footer className="m-center bg-caoba-deep text-white/80">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <Image src="/brand/logo-arena.svg" alt={site.name} width={983} height={805} className="h-24 w-auto" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">{t("tagline")}</p>
          <p className="font-ui mt-4 text-xs tracking-widest text-arena/70 uppercase">By {site.developer}</p>
        </div>
        <div>
          <p className="eyebrow text-arena">{t("navTitle")}</p>
          <ul className="mt-4 grid gap-2.5 text-sm">
            {SECTIONS.map((id) => (
              <li key={id}>
                <a href={`${home}#${id}`} className="transition-colors hover:text-white">
                  {tn(id)}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-arena">{t("contactTitle")}</p>
          <ul className="mt-4 grid gap-2.5 text-sm">
            <li>
              <a href={whatsappLink(tw("general"))} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                WhatsApp {site.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={site.driveUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                {t("drive")}
              </a>
            </li>
            <li>
              <Link href="/aviso-de-privacidad" className="transition-colors hover:text-white">
                {t("privacy")}
              </Link>
            </li>
            <li className="text-white/60">
              {site.city}, {site.state}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-white/50 sm:px-6 md:flex-row md:justify-between lg:px-8">
          <p className="max-w-2xl">{t("disclaimer")}</p>
          <p className="shrink-0">
            © {new Date().getFullYear()} {site.name}. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
