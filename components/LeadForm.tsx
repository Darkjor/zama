"use client";
// "use client": useActionState para el estado del envío y un efecto que lee
// UTM/referrer del navegador para atribuir el lead a su campaña.

import { useActionState, useEffect, useId, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { sendLead } from "@/lib/leads";
import type { LeadField, LeadFormState } from "@/lib/lead-schema";
import { whatsappLink } from "@/lib/whatsapp";

const initial: LeadFormState = { status: "idle" };
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;

type Props = {
  variant: "cotizacion" | "broker";
  className?: string;
};

export function LeadForm({ variant, className = "" }: Props) {
  const t = useTranslations("form");
  const tw = useTranslations("whatsapp");
  const locale = useLocale();
  const uid = useId();
  const [state, action, pending] = useActionState(sendLead, initial);
  const hidden = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    // Las UTM se guardan en sessionStorage al llegar, para no perderlas si la
    // persona cambia de idioma o recarga antes de enviar.
    const params = new URLSearchParams(window.location.search);
    for (const key of UTM_KEYS) {
      let value = params.get(key);
      try {
        if (value) sessionStorage.setItem(key, value);
        else value = sessionStorage.getItem(key);
      } catch {}
      if (value && hidden.current[key]) hidden.current[key]!.value = value;
    }
    if (hidden.current.referrer && document.referrer && !document.referrer.includes(window.location.host)) {
      hidden.current.referrer.value = document.referrer;
    }
  }, []);

  const errors = state.status === "invalid" ? state.errors : {};
  const values: Record<string, string> = state.status === "invalid" ? state.values : {};
  const err = (f: LeadField) => (errors[f] ? t(errors[f] as "errNombre") : undefined);
  const title = variant === "broker" ? t("titleBroker") : t("titleCotiza");

  if (state.status === "success") {
    return (
      <div className={`rounded-2xl bg-caoba p-7 text-white shadow-2xl shadow-caoba-deep/30 sm:p-8 ${className}`} role="status">
        <svg viewBox="0 0 24 24" className="mb-4 size-10 text-arena" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path d="M7.5 12.5l3 3 6-6.5" />
        </svg>
        <p className="display text-3xl">{t("ok")}</p>
        <a
          href={whatsappLink(tw("general"))}
          target="_blank"
          rel="noopener noreferrer"
          className="font-ui mt-6 inline-flex text-sm text-arena underline underline-offset-4 hover:text-white"
        >
          {t("okWhatsapp")}
        </a>
      </div>
    );
  }

  return (
    <form
      action={action}
      noValidate
      className={`rounded-2xl bg-caoba p-6 text-white shadow-2xl shadow-caoba-deep/30 sm:p-8 ${className}`}
      aria-labelledby={`${uid}-title`}
    >
      <h3 id={`${uid}-title`} className="display mb-5 text-3xl">
        {title}
      </h3>

      <input type="hidden" name="tipo" value={variant} />
      <input type="hidden" name="locale" value={locale} />
      {UTM_KEYS.map((k) => (
        <input key={k} type="hidden" name={k} ref={(el) => void (hidden.current[k] = el)} />
      ))}
      <input type="hidden" name="referrer" ref={(el) => void (hidden.current.referrer = el)} />
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4">
        <Field id={`${uid}-nombre`} label={t("nombre")} error={err("nombre")}>
          <input id={`${uid}-nombre`} name="nombre" defaultValue={values.nombre} autoComplete="name" required className="field" aria-invalid={!!err("nombre")} aria-describedby={err("nombre") ? `${uid}-nombre-err` : undefined} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id={`${uid}-telefono`} label={t("telefono")} error={err("telefono")}>
            <input id={`${uid}-telefono`} name="telefono" defaultValue={values.telefono} type="tel" inputMode="tel" autoComplete="tel" required className="field" aria-invalid={!!err("telefono")} aria-describedby={err("telefono") ? `${uid}-telefono-err` : undefined} />
          </Field>
          <Field id={`${uid}-email`} label={t("email")} error={err("email")}>
            <input id={`${uid}-email`} name="email" defaultValue={values.email} type="email" autoComplete="email" className="field" aria-invalid={!!err("email")} aria-describedby={err("email") ? `${uid}-email-err` : undefined} />
          </Field>
        </div>
        {variant === "cotizacion" ? (
          <Field id={`${uid}-interes`} label={t("interes")}>
            <select id={`${uid}-interes`} name="interes" className="field" defaultValue={values.interes || "lote"}>
              <option value="lote">{t("interesLote")}</option>
              <option value="villa">{t("interesVilla")}</option>
              <option value="indeciso">{t("interesAmbos")}</option>
            </select>
          </Field>
        ) : (
          <Field id={`${uid}-empresa`} label={t("empresa")}>
            <input id={`${uid}-empresa`} name="empresa" defaultValue={values.empresa} autoComplete="organization" className="field" />
          </Field>
        )}
        <Field id={`${uid}-mensaje`} label={t("mensaje")}>
          <textarea id={`${uid}-mensaje`} name="mensaje" defaultValue={values.mensaje} rows={2} maxLength={2000} className="field resize-none" />
        </Field>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="font-ui mt-6 flex w-full items-center justify-center rounded-full bg-crema px-6 py-3.5 text-sm font-medium tracking-wide text-caoba transition-colors hover:bg-white disabled:opacity-70"
      >
        {pending ? t("enviando") : t("enviar")}
      </button>

      <div aria-live="polite" className="empty:hidden">
        {state.status === "invalid" && <p className="mt-3 text-sm text-[#ffd9c7]">{t("invalid")}</p>}
        {state.status === "error" && <p className="mt-3 text-sm text-[#ffd9c7]">{t("error")}</p>}
      </div>

      <p className="mt-4 text-center text-xs text-white/65">
        {t("privacy")}{" "}
        <Link href="/aviso-de-privacidad" className="underline underline-offset-2 hover:text-white">
          {t("privacyLink")}
        </Link>
        .
      </p>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="font-ui text-xs font-light tracking-wide text-white/80">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="text-xs text-[#ffd9c7]">
          {error}
        </p>
      )}
    </div>
  );
}
