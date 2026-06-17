import type { CSSProperties, ReactNode } from 'react'
import { brand } from '../../data/brand'
import { bl, lh, marginX } from '../../data/gridSystem'
import { brandShapes } from '../../utils/assetPaths'
import { ditherPatterns, ditherTileSize } from '../../utils/ditherPattern'

type ShapeIndex = 1 | 2 | 3 | 4

interface DitherTextureProps {
  s: number
  pattern?: keyof typeof ditherPatterns
  tileBase?: number
  opacity?: number
  blendMode?: CSSProperties['mixBlendMode']
  style?: CSSProperties
}

/** Localised ordered-dither texture — use over flat fills and gradients */
export function DitherTexture({
  s,
  pattern = 'bayer4',
  tileBase = 4,
  opacity = 0.45,
  blendMode = 'overlay',
  style,
}: DitherTextureProps) {
  const tile = ditherTileSize(s, tileBase)

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity,
        mixBlendMode: blendMode,
        backgroundImage: ditherPatterns[pattern],
        backgroundRepeat: 'repeat',
        backgroundSize: `${tile}px ${tile}px`,
        imageRendering: 'pixelated',
        ...style,
      }}
    />
  )
}

interface DitherOverlayProps {
  s: number
  dark?: boolean
}

/** Full-canvas print grain — sits above content for a unified poster finish */
export function DitherOverlay({ s, dark = false }: DitherOverlayProps) {
  const tile = ditherTileSize(s, 4)

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 20,
        opacity: dark ? 0.11 : 0.07,
        mixBlendMode: dark ? 'soft-light' : 'multiply',
        backgroundImage: ditherPatterns.bayer8,
        backgroundRepeat: 'repeat',
        backgroundSize: `${tile}px ${tile}px`,
        imageRendering: 'pixelated',
      }}
    />
  )
}

interface ChromaticBarsProps {
  s: number
  direction?: 'horizontal' | 'vertical'
  thickness?: number
  length?: number | string
  style?: CSSProperties
}

/** Four-bar brand spectrum — burnt orange → muted yellow */
export function ChromaticBars({
  s,
  direction = 'horizontal',
  thickness,
  length,
  style,
}: ChromaticBarsProps) {
  const barThickness = thickness ?? bl(1, s)
  const isHorizontal = direction === 'horizontal'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        width: isHorizontal ? (length ?? '100%') : barThickness * brand.chromatic.length,
        height: isHorizontal ? barThickness : (length ?? '100%'),
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {brand.chromatic.map((color) => (
        <div
          key={color}
          style={{
            flex: 1,
            background: color,
            width: isHorizontal ? undefined : '100%',
            height: isHorizontal ? '100%' : undefined,
          }}
        />
      ))}
      <DitherTexture s={s} pattern="halftone" tileBase={2} opacity={0.55} blendMode="soft-light" />
    </div>
  )
}

interface BrandShapeProps {
  shape: ShapeIndex
  size: number
  style?: CSSProperties
  opacity?: number
}

export function BrandShape({ shape, size, style, opacity = 1 }: BrandShapeProps) {
  const src = brandShapes[shape - 1]
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      crossOrigin="anonymous"
      style={{
        width: size,
        height: 'auto',
        display: 'block',
        opacity,
        ...style,
      }}
    />
  )
}

/** Warm dot grid — corner texture, stays behind content */
export function GeoDotGrid({
  s,
  dark = false,
  style,
}: {
  s: number
  dark?: boolean
  style?: CSSProperties
}) {
  const opacity = dark ? brand.geometry.dotGridOpacity.dark : brand.geometry.dotGridOpacity.light
  const dot = brand.colors.burntOrange

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        backgroundImage: `radial-gradient(circle, ${dot} 1px, transparent 1px)`,
        backgroundSize: `${bl(2, s)}px ${bl(2, s)}px`,
        opacity,
        ...style,
      }}
    />
  )
}

/** L-brackets — geometric photo frame accent */
export function GeoCornerBrackets({
  s,
  dark = false,
  inset = 10,
  arm = 22,
}: {
  s: number
  dark?: boolean
  inset?: number
  arm?: number
}) {
  const color = dark ? brand.geometry.bracketColor.dark : brand.geometry.bracketColor.light
  const pad = inset * s
  const len = arm * s
  const weight = Math.max(2, 2.5 * s)

  const corner = (top: boolean, left: boolean): CSSProperties => ({
    position: 'absolute',
    width: len,
    height: len,
    ...(top ? { top: pad } : { bottom: pad }),
    ...(left ? { left: pad } : { right: pad }),
    borderColor: color,
    borderStyle: 'solid',
    borderWidth: 0,
    ...(top && left && { borderTopWidth: weight, borderLeftWidth: weight }),
    ...(top && !left && { borderTopWidth: weight, borderRightWidth: weight }),
    ...(!top && left && { borderBottomWidth: weight, borderLeftWidth: weight }),
    ...(!top && !left && { borderBottomWidth: weight, borderRightWidth: weight }),
  })

  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }}>
      <div style={corner(true, true)} />
      <div style={corner(true, false)} />
      <div style={corner(false, true)} />
      <div style={corner(false, false)} />
    </div>
  )
}

/** Short chromatic rule — separates headline from body copy */
export function GeoSectionDivider({
  s,
  style,
}: {
  s: number
  style?: CSSProperties
}) {
  return (
    <ChromaticBars
      s={s}
      direction="horizontal"
      thickness={bl(1, s)}
      length={lh(8, s)}
      style={{ marginTop: bl(2, s), marginBottom: bl(1, s), ...style }}
    />
  )
}

interface EyebrowLabelProps {
  s: number
  text: string
  dark?: boolean
}

/** Campaign eyebrow with geometric chromatic dash */
export function EyebrowLabel({ s, text, dark }: EyebrowLabelProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: bl(2, s),
        marginBottom: bl(2, s),
        minWidth: 0,
      }}
    >
      <ChromaticBars s={s} direction="horizontal" thickness={bl(1, s)} length={bl(6, s)} />
      <p
        style={{
          fontFamily: "'Inter', ui-monospace, monospace",
          fontSize: 16 * s,
          letterSpacing: '0.14em',
          lineHeight: `${lh(1, s)}px`,
          textTransform: 'uppercase',
          color: dark ? brand.colors.white : brand.colors.black,
          opacity: dark ? 0.75 : 0.55,
          margin: 0,
          minWidth: 0,
          overflowWrap: 'break-word',
        }}
      >
        {text}
      </p>
    </div>
  )
}

interface HeadlineGeometryProps {
  s: number
  dark?: boolean
  children: ReactNode
  lineCount: number
  lineHeightPx: number
}

/** Left chromatic spine + circle accent — frames headlines without competing */
export function HeadlineGeometry({ s, dark, children, lineCount, lineHeightPx }: HeadlineGeometryProps) {
  const shapeOpacity = dark ? brand.geometry.shapeOpacity.dark : brand.geometry.shapeOpacity.light

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: bl(2, s), minWidth: 0 }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
          width: bl(2, s),
          gap: bl(1, s),
        }}
      >
        <ChromaticBars
          s={s}
          direction="vertical"
          thickness={bl(1, s)}
          length={Math.max(lineHeightPx * lineCount * 0.72, lh(4, s))}
        />
        <BrandShape shape={2} size={28 * s} opacity={shapeOpacity * 1.2} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>{children}</div>
    </div>
  )
}

interface PosterBackdropProps {
  s: number
  dark?: boolean
}

/** Edge-framed abstract geometry — shapes & bars stay at margins, type & photos stay clear */
export function PosterBackdrop({ s, dark = false }: PosterBackdropProps) {
  const padX = marginX(s)
  const shapeOpacity = dark ? brand.geometry.shapeOpacity.dark : brand.geometry.shapeOpacity.light
  const [c0, c1, c2, c3] = brand.chromatic

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Warm chromatic wash */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: dark
            ? `linear-gradient(155deg, ${c0}22 0%, transparent 35%, transparent 70%, ${c3}18 100%)`
            : `linear-gradient(155deg, ${c1}14 0%, transparent 40%, ${c2}10 100%)`,
        }}
      />
      <DitherTexture
        s={s}
        pattern="bayer8"
        tileBase={8}
        opacity={dark ? 0.3 : 0.22}
        blendMode={dark ? 'soft-light' : 'overlay'}
        style={{ inset: 0 }}
      />

      {/* Corner dot grids */}
      <GeoDotGrid
        s={s}
        dark={dark}
        style={{ top: lh(8, s), left: padX, width: lh(12, s), height: lh(12, s) }}
      />
      <GeoDotGrid
        s={s}
        dark={dark}
        style={{ bottom: lh(14, s), right: padX * 0.5, width: lh(10, s), height: lh(10, s) }}
      />

      {/* Edge chromatic bars */}
      <ChromaticBars
        s={s}
        direction="vertical"
        thickness={bl(2, s)}
        length={lh(22, s)}
        style={{
          position: 'absolute',
          right: 0,
          top: lh(12, s),
          opacity: dark ? 0.5 : 0.38,
        }}
      />
      <ChromaticBars
        s={s}
        direction="horizontal"
        thickness={bl(1, s)}
        length={lh(12, s)}
        style={{
          position: 'absolute',
          left: padX,
          top: lh(11, s),
          opacity: dark ? 0.4 : 0.32,
        }}
      />
      <ChromaticBars
        s={s}
        direction="horizontal"
        thickness={bl(1, s)}
        length={lh(14, s)}
        style={{
          position: 'absolute',
          left: padX,
          bottom: lh(13, s),
          opacity: dark ? 0.42 : 0.34,
        }}
      />

      {/* Edge brand shapes — never over the content grid centre */}
      <BrandShape
        shape={1}
        size={200 * s}
        opacity={shapeOpacity}
        style={{
          position: 'absolute',
          right: -40 * s,
          top: lh(4, s),
          transform: 'rotate(14deg)',
        }}
      />
      <BrandShape
        shape={2}
        size={140 * s}
        opacity={shapeOpacity * 0.9}
        style={{
          position: 'absolute',
          left: -56 * s,
          top: lh(18, s),
        }}
      />
      <BrandShape
        shape={3}
        size={260 * s}
        opacity={shapeOpacity * 0.7}
        style={{
          position: 'absolute',
          left: -80 * s,
          bottom: lh(6, s),
          transform: 'rotate(-4deg)',
        }}
      />
      <BrandShape
        shape={4}
        size={220 * s}
        opacity={shapeOpacity * 0.85}
        style={{
          position: 'absolute',
          right: -24 * s,
          bottom: -48 * s,
        }}
      />
    </div>
  )
}
