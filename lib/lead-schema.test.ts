import { describe, expect, it } from "vitest";
import { leadSchema, readLeadForm } from "./lead-schema";

function form(values: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(values)) fd.set(k, v);
  return readLeadForm(fd);
}

describe("leadSchema", () => {
  it("acepta un lead mínimo y convierte vacíos en null", () => {
    const r = leadSchema.safeParse(form({ tipo: "cotizacion", nombre: "Ana López", telefono: "998 733 1784", locale: "es" }));
    expect(r.success).toBe(true);
    expect(r.data?.email).toBeNull();
    expect(r.data?.mensaje).toBeNull();
  });

  it("rechaza teléfono con menos de 10 dígitos y correo inválido", () => {
    const r = leadSchema.safeParse(form({ tipo: "contacto", nombre: "Ana", telefono: "12345", email: "no-es-correo" }));
    expect(r.success).toBe(false);
    const fields = r.error?.issues.map((i) => i.path[0]);
    expect(fields).toContain("telefono");
    expect(fields).toContain("email");
  });

  it("antepone la inmobiliaria del broker al mensaje", () => {
    const r = leadSchema.safeParse(form({ tipo: "broker", nombre: "Luis", telefono: "5512345678", empresa: "Casa MX", mensaje: "Hola" }));
    expect(r.data?.mensaje).toBe("[Casa MX] Hola");
  });

  it("guarda la preferencia de contacto válida y descarta valores inventados", () => {
    const ok = leadSchema.safeParse(form({ tipo: "cotizacion", nombre: "Ana", telefono: "5512345678", contacto_preferido: "llamada" }));
    expect(ok.data?.contacto_preferido).toBe("llamada");
    const raro = leadSchema.safeParse(form({ tipo: "cotizacion", nombre: "Ana", telefono: "5512345678", contacto_preferido: "fax" }));
    expect(raro.data?.contacto_preferido).toBeNull();
  });

  it("cae a 'es' con un locale desconocido", () => {
    const r = leadSchema.safeParse(form({ tipo: "contacto", nombre: "Luis", telefono: "5512345678", locale: "fr" }));
    expect(r.data?.locale).toBe("es");
  });
});
