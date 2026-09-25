import { getTranslations } from "next-intl/server";
import { WhatsappLogo } from "@phosphor-icons/react/ssr";
import { whatsappLink } from "@/lib/whatsapp";

export async function WhatsAppFloat() {
  const t = await getTranslations("whatsapp");
  return (
    <a
      href={whatsappLink(t("general"))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("label")}
      className="fixed right-4 bottom-4 z-30 inline-flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return <WhatsappLogo weight="fill" className={className} aria-hidden />;
}
