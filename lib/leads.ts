"use server";

import { createClient } from "@/lib/supabase/server";
import { leadSchema, readLeadForm, type LeadField, type LeadFormState } from "@/lib/lead-schema";

export async function sendLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  // Honeypot: campo oculto que una persona nunca llena. A un bot se le
  // responde "éxito" para que no reintente, pero no se guarda nada.
  if (String(formData.get("website") ?? "") !== "") return { status: "success" };

  const parsed = leadSchema.safeParse(readLeadForm(formData));
  if (!parsed.success) {
    const errors: Partial<Record<LeadField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if ((field === "nombre" || field === "telefono" || field === "email") && !errors[field]) {
        errors[field] = issue.message;
      }
    }
    return { status: "invalid", errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert(parsed.data);
  if (error) {
    console.error("[leads] insert falló:", error.message);
    return { status: "error" };
  }
  return { status: "success" };
}
