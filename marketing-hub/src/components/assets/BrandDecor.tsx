import type { CSSProperties } from 'react'
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

interface PosterBackdropProps {
  s: number
  dark?: boolean
}

/** Decorative layer — chromatic wash, edge bars, and brand shapes */
export function PosterBackdrop({ s, dark = false }: PosterBackdropProps) {
  const padX = marginX(s)
  const shapeOpacity = dark ? 0.38 : 0.14
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
      {/* Chromatic gradient wash */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: dark
            ? `linear-gradient(145deg, ${c0}28 0%, transparent 38%, transparent 62%, ${c3}20 100%)`
            : `linear-gradient(145deg, ${c1}18 0%, transparent 42%, ${c2}12 100%)`,
        }}
      />
      <DitherTexture
        s={s}
        pattern="bayer8"
        tileBase={8}
        opacity={dark ? 0.35 : 0.28}
        blendMode={dark ? 'soft-light' : 'overlay'}
        style={{ inset: 0 }}
      />

      {/* Vertical chromatic bars — right edge */}
      <ChromaticBars
        s={s}
        direction="vertical"
        thickness={bl(2, s)}
        length={lh(26, s)}
        style={{
          position: 'absolute',
          right: 0,
          top: lh(10, s),
          opacity: dark ? 0.55 : 0.4,
        }}
      />

      {/* Horizontal chromatic bars — bottom-left accent */}
      <ChromaticBars
        s={s}
        direction="horizontal"
        thickness={bl(1, s)}
        length={lh(14, s)}
        style={{
          position: 'absolute',
          left: padX,
          bottom: lh(12, s),
          opacity: dark ? 0.45 : 0.35,
        }}
      />

      {/* shape1 — asterisk, top-right */}
      <BrandShape
        shape={1}
        size={240 * s}
        opacity={shapeOpacity}
        style={{
          position: 'absolute',
          right: -32 * s,
          top: lh(5, s),
          transform: 'rotate(12deg)',
        }}
      />

      {/* shape2 — circle, lower-left */}
      <BrandShape
        shape={2}
        size={180 * s}
        opacity={shapeOpacity * 0.85}
        style={{
          position: 'absolute',
          left: -48 * s,
          bottom: lh(8, s),
        }}
      />

      {/* shape3 — wave, mid-right */}
      <BrandShape
        shape={3}
        size={320 * s}
        opacity={shapeOpacity * 0.75}
        style={{
          position: 'absolute',
          right: padX * 0.4,
          top: '42%',
          transform: 'translateY(-50%) rotate(-6deg)',
        }}
      />

      {/* shape4 — semicircle, bottom-right */}
      <BrandShape
        shape={4}
        size={280 * s}
        opacity={shapeOpacity * 0.9}
        style={{
          position: 'absolute',
          right: -20 * s,
          bottom: -40 * s,
        }}
      />
    </div>
  )
}
