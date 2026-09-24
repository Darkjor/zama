import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Conecta `i18n/request.ts` (el `getRequestConfig` que resuelve locale y
// mensajes por peticion) con el build de Next. Sin este plugin, `proxy.ts`
// seguiria resolviendo el locale pero los server components no tendrian
// acceso a `useTranslations`/`getMessages`.
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
