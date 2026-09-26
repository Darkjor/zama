import { disponibilidad, pricePerM2, site, tipologias, ubicacion } from "@/lib/site";
import { formatDate, formatMXN, formatNumber } from "@/lib/format";
import { SITE_URL } from "@/lib/seo";

// /llms.txt (llmstxt.org): resumen en Markdown para asistentes de IA
// (ChatGPT, Claude, Perplexity…). Se arma con los mismos datos de
// `lib/site.ts`, así que se actualiza solo al cambiar precios o disponibilidad.
export const dynamic = "force-static";

export function GET() {
  const lotes = tipologias.filter((tp) => tp.frente && tp.fondo);
  const villa = tipologias.find((tp) => tp.plantas)!;
  const mxn = (n: number) => `${formatMXN(n, "es")} MXN`;

  const body = `# ${site.name}

> Desarrollo residencial ecológico de lotes residenciales y Villas Boutique en ${site.city}, ${site.state}, México, a ${ubicacion.lagunaMetros} m de la Laguna de Bacalar (Laguna de los Siete Colores). Desarrollado por ${site.developer}.

## Datos clave

- Ubicación: ${site.city}, ${site.state}. A ${ubicacion.lagunaMetros} m de la Laguna de Bacalar y a ${ubicacion.carreteraMetros} m de la carretera, frente a la biosfera African Safari.
${lotes.map((l, i) => `- Lote Residencial ${String.fromCharCode(65 + i)}: ${formatNumber(l.area, "es")} m² (${formatNumber(l.frente!, "es")} × ${formatNumber(l.fondo!, "es")} m), desde ${mxn(l.priceFrom)}.`).join("\n")}
- Precio por m² de lote: ${mxn(pricePerM2)}.
- Villa Boutique: ${villa.area} m² de construcción (${villa.plantas!.baja} m² planta baja + ${villa.plantas!.alta} m² planta alta), diseño bioclimático, desde ${mxn(villa.priceFrom)}.
- Certeza jurídica: uso de suelo autorizado, Manifestación de Impacto Ambiental (MIA) y escrituración.
- Disponibilidad al ${formatDate(disponibilidad.fecha, "es")}: ${disponibilidad.disponibles} de ${disponibilidad.totales} lotes disponibles en Fase 1. Fase 2 próximamente.
- Diseño sustentable: iluminación natural, ventilación cruzada, materiales locales y vegetación nativa.

Precios en pesos mexicanos, sujetos a cambio sin previo aviso y a disponibilidad.

## Contacto

- WhatsApp: +${site.whatsapp} (${site.whatsappDisplay})
- Sitio: ${SITE_URL}
- Brokers y asesores inmobiliarios pueden unirse a la red de aliados desde el formulario del sitio.

## Páginas

- [Inicio (español)](${SITE_URL}/): tipologías, precios, disponibilidad, ubicación y preguntas frecuentes.
- [Home (English)](${SITE_URL}/en): the same information in English.
- [Brochure y fichas técnicas](${site.driveUrl}): brochure, fichas técnicas y documentos del desarrollo.
- [Aviso de privacidad](${SITE_URL}/aviso-de-privacidad)
`;

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
