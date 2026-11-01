/** Deterministic Folio spine palette keyed by course code prefix / hash */

const PALETTE = [
  { key: 'comp', from: '#C45C4A', mid: '#C45C4A', to: '#C45C4A', accent: '#C45C4A' },
  { key: 'writ', from: '#3D6B9A', mid: '#3D6B9A', to: '#3D6B9A', accent: '#3D6B9A' },
  { key: 'hist', from: '#4A7A52', mid: '#4A7A52', to: '#4A7A52', accent: '#4A7A52' },
  { key: 'gold', from: '#A08020', mid: '#A08020', to: '#A08020', accent: '#A08020' },
  { key: 'purple', from: '#6E508C', mid: '#6E508C', to: '#6E508C', accent: '#6E508C' },
  { key: 'teal', from: '#3A7A7A', mid: '#3A7A7A', to: '#3A7A7A', accent: '#3A7A7A' },
  { key: 'rust', from: '#B07040', mid: '#B07040', to: '#B07040', accent: '#B07040' },
] as const;

const PREFIX_MAP: Record<string, number> = {
  COMP: 0,
  CS: 0,
  WRIT: 1,
  ENG: 1,
  HIST: 2,
  HIS: 2,
  MATH: 3,
  BUS: 4,
  SCI: 5,
  ART: 6,
};

export type SpinePalette = (typeof PALETTE)[number];

export function spinePaletteForCode(code: string): SpinePalette {
  const prefix = (code || '').replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4);
  if (PREFIX_MAP[prefix] != null) return PALETTE[PREFIX_MAP[prefix]];
  for (let n = 4; n >= 2; n--) {
    const p = prefix.slice(0, n);
    if (PREFIX_MAP[p] != null) return PALETTE[PREFIX_MAP[p]];
  }
  let hash = 0;
  for (let i = 0; i < code.length; i++) hash = (hash * 31 + code.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

export function spineGradient(palette: SpinePalette): string {
  return palette.mid;
}

/** Slim Folio color-bar height */
export function spineHeight(code: string, base = 40, spread = 16): number {
  let hash = 0;
  for (let i = 0; i < code.length; i++) hash = (hash * 33 + code.charCodeAt(i)) >>> 0;
  return base + (hash % spread);
}

export function spineWidth(_code: string, base = 8, _spread = 0): number {
  return base;
}

export function spineColor(code: string): string {
  return spinePaletteForCode(code).mid;
}
