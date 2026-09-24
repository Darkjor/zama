// Fuente única de los datos del desarrollo. Todo lo que es un DATO (precio,
// m², teléfono, enlace, conteo de lotes) vive aquí; los textos de marketing
// viven en `messages/{es,en}.json`. Para actualizar precios o disponibilidad
// se edita solo este archivo.
//
// Origen de cada cifra (carpeta "Zama" que entregó el cliente, sept 2026):
//   - Precios y m² de lotes: "LISTA DE PRECIOS ZAMÄ BACALAR 2026".
//   - Villas y "desde": "BROCHURE ZAMÄ BACALAR 2026".
//   - Disponibilidad: "Disponibilidad ZAMÄ Bacalar 28082026".
// No agregar cifras que no estén en esos documentos.

export const site = {
  name: "ZAMÄ Bacalar",
  shortName: "ZAMÄ",
  developer: "Mexo Company",
  domain: "zamabacalar.com",
  city: "Bacalar",
  state: "Quintana Roo",

  /** WhatsApp comercial, formato internacional sin "+" ni espacios. */
  whatsapp: "529987331784",
  whatsappDisplay: "998 733 1784",

  /**
   * Carpeta de Drive con brochure, fichas y pack legal. Se enlaza en lugar de
   * servir PDFs desde el sitio para que el equipo comercial los mantenga
   * actualizados sin redeploy.
   */
  driveUrl: "https://drive.google.com/drive/folders/1qnQrOFwN10p_Eo1WHXeBI1A8pBwDaMgd",
} as const;

/**
 * Oculta todo lo que menciona amenidades (sección "Casa Club" y la tarjeta
 * del carrusel "Vivir en ZAMÄ") mientras el cliente confirma cuáles serán
 * las amenidades reales. Cambiar a `true` para volver a mostrarlo.
 */
export const mostrarAmenidades = false;

export const pricePerM2 = 3470;

export type Tipologia = {
  id: "lote-a" | "lote-b" | "villa";
  image: string;
  /** m² de terreno (lotes) o de construcción (villas). */
  area: number;
  frente?: number;
  fondo?: number;
  /** Construcción por planta, solo villas. */
  plantas?: { baja: number; alta: number };
  priceFrom: number;
};

export const tipologias: Tipologia[] = [
  { id: "lote-a", image: "/img/lotes-aereo.webp", area: 461.5, frente: 13, fondo: 35.5, priceFrom: 1601405 },
  { id: "lote-b", image: "/img/amanecer.webp", area: 532.5, frente: 15, fondo: 35.5, priceFrom: 1847775 },
  { id: "villa", image: "/img/villa-fachada.webp", area: 225, plantas: { baja: 125, alta: 100 }, priceFrom: 5200000 },
];

export const disponibilidad = {
  fecha: "2026-08-28",
  totales: 56,
  vendidos: 27,
  apartados: 0,
  disponibles: 29,
} as const;

export const ubicacion = {
  lagunaMetros: 400,
  carreteraMetros: 500,
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bacalar%2C+Quintana+Roo",
} as const;
