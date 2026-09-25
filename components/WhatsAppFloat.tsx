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
      className="fixed right-4 bottom-4 z-30 inline-flex size-16 items-center justify-center drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-transform hover:scale-105 active:scale-95 sm:right-6 sm:bottom-6"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Logo como el oficial (a pedido del cliente): burbuja verde con el
          teléfono en blanco, sin círculo de fondo. El círculo blanco de atrás
          es el que "rellena" el teléfono, que en el glifo es un hueco. */}
      <span aria-hidden className="absolute inset-[22%] rounded-full bg-white" />
      <WhatsappLogo weight="fill" aria-hidden className="relative size-full text-[#25d366]" />
    </a>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return <WhatsappLogo weight="fill" className={className} aria-hidden />;
}
