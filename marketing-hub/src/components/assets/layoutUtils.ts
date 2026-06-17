import type { CSSProperties } from 'react'
import { brand } from '../../data/brand'
import { GRID } from '../../data/gridSystem'
import type { AssetContent } from '../../data/types'

const accentMap = {
  burntOrange: brand.colors.burntOrange,
  brightOrange: brand.colors.brightOrange,
  solidYellow: brand.colors.solidYellow,
  mutedYellow: brand.colors.mutedYellow,
} as const

export function accentColor(content: AssetContent): string {
  return accentMap[content.accent ?? 'solidYellow']
}

export function headlineLines(headline: AssetContent['headline']): string[] {
  return Array.isArray(headline) ? headline : [headline]
}

/** Shared body region — keeps content inside the canvas without overlapping header/footer. */
export function canvasBodyStyle(extra?: CSSProperties): CSSProperties {
  return {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    ...extra,
  }
}

const textContain: CSSProperties = {
  minWidth: 0,
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
}

export function containedTextStyle(extra?: CSSProperties): CSSProperties {
  return { ...textContain, ...extra }
}

/** Snap display headline line-height to baseline grid — never below glyph bounds (export-safe). */
export function headlineLineHeight(fontSize: number, s: number): number {
  const step = GRID.baseline * s
  const minHeight = fontSize * 1.06 + step * 0.5
  return Math.max(Math.ceil(minHeight / step) * step, fontSize)
}

/** Scale header index — times and long strings need smaller type to avoid column bleed. */
export function indexFontSize(index: string, s: number): number {
  const base = 160 * s
  if (index.includes(':')) return base * 0.72
  if (index.length > 3) return base * 0.62
  if (index.length > 2) return base * 0.82
  return base
}

export function indexLineHeight(index: string, s: number): number {
  const size = indexFontSize(index, s)
  return headlineLineHeight(size, s)
}

/** Shrink long footer CTAs so they stay inside the center grid column. */
export function ctaFontSize(cta: string, s: number): number {
  if (cta.length > 32) return 15 * s
  if (cta.length > 26) return 17 * s
  if (cta.length > 20) return 19 * s
  return 22 * s
}
