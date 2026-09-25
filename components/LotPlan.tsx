import { formatNumber } from "@/lib/format";

/**
 * Planta del lote dibujada A ESCALA a partir de frente × fondo (lib/site.ts).
 * Todos los lotes comparten la misma escala (`maxFondo`), así que un lote con
 * más frente se ve visiblemente más ancho. Es un dato, no una ilustración.
 */
export function LotPlan({ frente, fondo, maxFondo, locale, label }: { frente: number; fondo: number; maxFondo: number; locale: string; label: string }) {
  const H = 170; // alto en px del fondo más largo
  const scale = H / maxFondo;
  const w = frente * scale;
  const h = fondo * scale;
  const padL = 38;
  const padT = 26;
  const vw = padL + w + 10;
  const vh = padT + h + 6;

  return (
    <svg viewBox={`0 0 ${vw} ${vh}`} width={vw} height={vh} role="img" aria-label={label} className="shrink-0 overflow-visible">
      {/* Lote */}
      <rect x={padL} y={padT} width={w} height={h} rx="3" className="fill-arena/50 stroke-caoba" strokeWidth="1.25" />
      {/* Franja de acceso (frente a la vialidad) */}
      <line x1={padL} y1={padT + h} x2={padL + w} y2={padT + h} className="stroke-caoba" strokeWidth="3" strokeLinecap="round" />

      {/* Cota del frente */}
      <line x1={padL} y1={12} x2={padL + w} y2={12} className="stroke-tinta-soft" strokeWidth="0.75" />
      <line x1={padL} y1={8} x2={padL} y2={16} className="stroke-tinta-soft" strokeWidth="0.75" />
      <line x1={padL + w} y1={8} x2={padL + w} y2={16} className="stroke-tinta-soft" strokeWidth="0.75" />
      <text x={padL + w / 2} y={5} textAnchor="middle" className="fill-tinta font-ui text-[11px] font-medium">
        {formatNumber(frente, locale)} m
      </text>

      {/* Cota del fondo */}
      <line x1={22} y1={padT} x2={22} y2={padT + h} className="stroke-tinta-soft" strokeWidth="0.75" />
      <line x1={18} y1={padT} x2={26} y2={padT} className="stroke-tinta-soft" strokeWidth="0.75" />
      <line x1={18} y1={padT + h} x2={26} y2={padT + h} className="stroke-tinta-soft" strokeWidth="0.75" />
      <text x={10} y={padT + h / 2} textAnchor="middle" transform={`rotate(-90 10 ${padT + h / 2})`} className="fill-tinta font-ui text-[11px] font-medium">
        {formatNumber(fondo, locale)} m
      </text>
    </svg>
  );
}
