import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Cormorant_Garamond, Rubik, Signika } from "next/font/google";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { RevealObserver } from "@/components/RevealObserver";
import { ExitIntent } from "@/components/ExitIntent";
import { ALLOW_INDEXING, SITE_URL } from "@/lib/seo";
import { mostrarAmenidades, site } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-rubik",
  display: "swap",
});

const signika = Signika({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-signika",
  display: "swap",
});

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    applicationName: site.name,
    alternates: { canonical: locale === "en" ? "/en" : "/", languages: { es: "/", en: "/en" } },
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "es_MX",
      siteName: site.name,
      title: t("title"),
      description: t("description"),
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: site.name }],
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description"), images: ["/og.jpg"] },
    robots: ALLOW_INDEXING ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#80562a",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  // Al navegador solo viajan los textos de los componentes cliente (Header,
  // LeadForm, ExitIntent); el resto se resuelve en el servidor. Si un componente cliente
  // nuevo usa otro namespace, agregarlo aquí.
  const all = await getMessages();
  const { amenidades: waAmenidades, ...whatsapp } = all.whatsapp as Record<string, string>;
  const messages = {
    nav: all.nav,
    form: all.form,
    exit: all.exit,
    whatsapp: mostrarAmenidades ? { ...whatsapp, amenidades: waAmenidades } : whatsapp,
  };

  return (
    <html lang={locale} className={`${cormorant.variable} ${rubik.variable} ${signika.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        {GTM_ID && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="m-center flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <RevealObserver />
          <ExitIntent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
