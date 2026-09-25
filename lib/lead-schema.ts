import { z } from "zod";

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional();

export const leadSchema = z.object({
  tipo: z.enum(["cotizacion", "contacto", "broker"]),
  nombre: z.string().trim().min(2, "errNombre").max(120, "errNombre"),
  telefono: z
    .string()
    .trim()
    .max(30, "errTelefono")
    .refine((v) => v.replace(/\D/g, "").length >= 10, "errTelefono"),
  email: z
    .string()
    .trim()
    .max(160, "errEmail")
    .refine((v) => v === "" || z.email().safeParse(v).success, "errEmail")
    .transform((v) => (v === "" ? null : v)),
  interes: optional(60),
  contacto_preferido: z
    .enum(["whatsapp", "llamada", "correo", ""])
    .catch("")
    .transform((v) => (v === "" ? null : v)),
  mensaje: optional(2000),
  locale: z.enum(["es", "en"]).catch("es"),
  utm_source: optional(120),
  utm_medium: optional(120),
  utm_campaign: optional(120),
  referrer: optional(500),
}).superRefine((lead, ctx) => {
  if (lead.contacto_preferido === "correo" && !lead.email) {
    ctx.addIssue({ code: "custom", path: ["email"], message: "errEmailRequerido" });
  }
});

export type LeadField = "nombre" | "telefono" | "email";

export type LeadFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error" }
  | { status: "invalid"; errors: Partial<Record<LeadField, string>>; values: Record<string, string> };

export function readLeadForm(formData: FormData) {
  const get = (k: string) => String(formData.get(k) ?? "");
  const empresa = get("empresa").trim();
  const mensaje = get("mensaje").trim();
  return {
    tipo: get("tipo"),
    nombre: get("nombre"),
    telefono: get("telefono"),
    email: get("email"),
    interes: get("interes"),
    contacto_preferido: get("contacto_preferido"),
    // El formulario de brokers pide la inmobiliaria aparte; se guarda al
    // inicio del mensaje para no añadir una columna solo para eso.
    mensaje: empresa ? `[${empresa}] ${mensaje}`.trim() : mensaje,
    locale: get("locale"),
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    referrer: get("referrer"),
  };
}
