import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="bg-paper">
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <p className="display text-8xl text-caoba">404</p>
        <h1 className="display mt-4 text-3xl text-tinta">{t("title")}</h1>
        <p className="mt-3 text-tinta-soft">{t("body")}</p>
        <Link href="/" className="font-ui mt-8 inline-flex rounded-full bg-caoba px-6 py-3.5 text-sm font-medium text-white hover:bg-caoba-deep">
          {t("home")}
        </Link>
      </div>
    </div>
  );
}
