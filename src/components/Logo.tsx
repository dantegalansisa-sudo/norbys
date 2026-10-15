export function NMark({ size = 28, color = 'currentColor' }: { size?: number; color?: string }) {
  // Angular "N" monogram: two posts joined by a sharp diagonal, as on the garments
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M6 36V4h6.5L27.5 26V4H34v32h-6.5L12.5 14v22Z" fill={color} />
      <path d="M27.5 4H34L27.5 13Z" fill={color} opacity=".35" />
    </svg>
  );
}

export default function Logo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  const c = light ? '#fff' : 'var(--ink)';
  return (
    <span className="logo" style={{ color: c }} aria-label="NORBYS USA">
      {!compact && <NMark size={18} color={c} />}
      <span className="logo__words">
        <span className="logo__name">NORBYS</span>
        <span className="logo__usa">
          <i />USA<i />
        </span>
      </span>
    </span>
  );
}
