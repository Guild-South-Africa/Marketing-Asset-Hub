/**
 * Müller-Brockmann modular grid — single source of truth for poster/campaign layouts.
 * Reference artboard: 1600px wide (scale s = width / 1600).
 */
export const GRID = {
  cols: 12,
  baseline: 8,
  leading: 24,
  gutter: 24,
  margin: 96,
} as const

/** Scale factor from asset width to reference grid */
export function gridScale(width: number): number {
  return width / 1600
}

/** Baseline unit(s) in px at current scale */
export function bl(units: number, s: number): number {
  return GRID.baseline * units * s
}

/** Leading unit(s) in px at current scale */
export function lh(units: number, s: number): number {
  return GRID.leading * units * s
}

export function marginX(s: number): number {
  return GRID.margin * s
}

export function gutter(s: number): number {
  return GRID.gutter * s
}

/** Media module height locked to leading multiples */
export function mediaHeight(leadingUnits: number, s: number): number {
  return GRID.leading * leadingUnits * s
}

export const gridStyles = {
  twelveCol: (s: number) =>
    ({
      display: 'grid',
      gridTemplateColumns: `repeat(${GRID.cols}, 1fr)`,
      columnGap: gutter(s),
    }) as const,
}
