import type { AgendaItem } from '../../../data/types'
import type { ReactNode } from 'react'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { brand } from '../../../data/brand'
import { bl, gridScale, gutter, lh, marginX, mediaHeight } from '../../../data/gridSystem'
import { getStockPhoto } from '../../../utils/assetPaths'
import { applyCoverFit } from '../../../utils/imageCover'
import { ctaFontSize, headlineLineHeight, indexFontSize, indexLineHeight } from '../layoutUtils'
import { BrandShape, ChromaticBars, DitherOverlay, GeoCornerBrackets, GeoSectionDivider, HeadlineGeometry, PosterBackdrop } from '../BrandDecor'
import { EcosystemLockup, GuildHeaderLogo, PartnerLockupStrip } from '../BrandElements'

const MONO = "'Inter', ui-monospace, monospace"

export { EyebrowLabel } from '../BrandDecor'

export function scale(width: number): number {
  return gridScale(width)
}

interface CanvasProps {
  width: number
  height: number
  dark?: boolean
  children: ReactNode
}

export function DesignCanvas({ width, height, dark = false, children }: CanvasProps) {
  const s = scale(width)

  return (
    <div
      style={{
        width,
        height,
        background: dark ? brand.colors.black : brand.colors.white,
        color: dark ? brand.colors.white : brand.colors.black,
        fontFamily: brand.fonts.body,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        isolation: 'isolate',
      }}
    >
      <PosterBackdrop s={s} dark={dark} />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          width: '100%',
        }}
      >
        {children}
      </div>
      <DitherOverlay s={s} dark={dark} />
    </div>
  )
}

interface MetaHeaderProps {
  s: number
  dark?: boolean
  index?: string
}

export function MetaHeader({ s, dark = false, index }: MetaHeaderProps) {
  const accent = brand.colors.mutedYellow
  const padX = marginX(s)
  const indexSize = index ? indexFontSize(index, s) : 0
  const indexLeading = index ? indexLineHeight(index, s) : 0

  return (
    <header
      style={{
        flexShrink: 0,
        padding: `${lh(3, s)}px ${padX}px ${index ? bl(2, s) : bl(1, s)}px`,
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        columnGap: gutter(s),
        alignItems: 'start',
      }}
    >
      <div style={{ gridColumn: '1 / 7', minWidth: 0 }}>
        <ChromaticBars
          s={s}
          direction="horizontal"
          thickness={bl(1, s)}
          length={bl(9, s)}
          style={{ marginBottom: bl(2, s) }}
        />
        <GuildHeaderLogo height={lh(2, s) + bl(1, s)} dark={dark} />
        <div
          style={{
            fontFamily: MONO,
            fontSize: 14 * s,
            letterSpacing: '0.1em',
            lineHeight: `${lh(1, s)}px`,
            marginTop: bl(1, s),
            opacity: dark ? 0.65 : 0.75,
          }}
        >
          AI BUILDATHON 01
        </div>
      </div>

      <div style={{ gridColumn: '7 / 13', minWidth: 0, textAlign: 'right', overflow: 'hidden' }}>
        {index && (
          <div
            style={{
              fontFamily: brand.fonts.display,
              fontSize: indexSize,
              fontWeight: 800,
              color: accent,
              lineHeight: `${indexLeading}px`,
              letterSpacing: '-0.04em',
            }}
          >
            {index}
          </div>
        )}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 16 * s,
            letterSpacing: '0.08em',
            lineHeight: `${lh(1, s)}px`,
            marginTop: index ? bl(1, s) : lh(1, s),
            overflowWrap: 'break-word',
          }}
        >
          <div>{brand.event.date.toUpperCase()}</div>
          <div style={{ opacity: 0.7 }}>{brand.event.location.toUpperCase()}</div>
        </div>
      </div>
    </header>
  )
}

interface MetaFooterProps {
  s: number
  dark?: boolean
  cta: string
  showPartnerLockup?: boolean
}

export function MetaFooter({ s, dark, cta, showPartnerLockup = true }: MetaFooterProps) {
  const accent = brand.colors.mutedYellow
  const padX = marginX(s)
  const ctaSize = ctaFontSize(cta, s)

  return (
    <div style={{ marginTop: 'auto', flexShrink: 0 }}>
      {showPartnerLockup && <EcosystemLockup s={s} dark={dark} />}
      <ChromaticBars s={s} direction="horizontal" thickness={bl(1, s)} style={{ width: '100%' }} />
      <footer
        style={{
          padding: `${lh(1, s) + bl(1, s)}px ${padX}px`,
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          columnGap: gutter(s),
          alignItems: 'center',
          fontFamily: MONO,
          fontSize: 17 * s,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        <div style={{ gridColumn: '1 / 5', minWidth: 0, lineHeight: `${lh(1, s)}px`, overflowWrap: 'break-word' }}>
          <div>{brand.event.builders} BUILDERS</div>
          <div style={{ opacity: 0.75 }}>BUILD SOMETHING THAT MATTERS</div>
          <div style={{ opacity: 0.75 }}>SOUTH AFRICA&apos;S STUDENT BUILDER ECOSYSTEM</div>
        </div>
        <div
          style={{
            gridColumn: '5 / 9',
            minWidth: 0,
            color: accent,
            fontFamily: brand.fonts.display,
            fontWeight: 700,
            fontSize: ctaSize,
            lineHeight: 1.25,
            textAlign: 'center',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            hyphens: 'auto',
          }}
        >
          {cta}
        </div>
        <div style={{ gridColumn: '9 / 13', minWidth: 0, textAlign: 'right', opacity: 0.85, overflowWrap: 'break-word' }}>
          07:00 – 17:00
        </div>
      </footer>
    </div>
  )
}

interface HeadlineProps {
  s: number
  lines: string[]
  size?: number
  dark?: boolean
}

export function StackedHeadline({ s, lines, size = 108, dark }: HeadlineProps) {
  const fontSize = size * s
  const snappedLine = headlineLineHeight(fontSize, s)

  return (
    <HeadlineGeometry s={s} dark={dark} lineCount={lines.length} lineHeightPx={snappedLine}>
      <div style={{ minWidth: 0 }}>
        {lines.map((line) => (
          <h1
            key={line}
            style={{
              fontFamily: brand.fonts.display,
              fontSize,
              fontWeight: 800,
              lineHeight: `${snappedLine}px`,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              margin: 0,
              padding: 0,
              color: dark ? brand.colors.white : brand.colors.black,
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}
          >
            {line}
          </h1>
        ))}
      </div>
    </HeadlineGeometry>
  )
}

export function GiantBackgroundNumber({
  s,
  value,
  dark,
}: {
  s: number
  value: string
  dark?: boolean
}) {
  const fontSize = value.length > 3 ? 260 * s : 320 * s

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        right: marginX(s),
        top: lh(5, s),
        maxWidth: '42%',
        fontFamily: brand.fonts.display,
        fontSize,
        fontWeight: 800,
        lineHeight: 0.9,
        color: brand.colors.mutedYellow,
        opacity: dark ? 0.35 : 0.22,
        pointerEvents: 'none',
        zIndex: 0,
        textAlign: 'right',
        overflow: 'hidden',
      }}
    >
      {value}
    </div>
  )
}

interface PhotoModuleProps {
  s: number
  stockIndex: number
  width?: number | string
  height?: number | string
  dark?: boolean
  showPartnerStrip?: boolean
}

export function PhotoModule({
  s,
  stockIndex,
  width = '100%',
  height,
  dark,
  showPartnerStrip,
}: PhotoModuleProps) {
  const border = dark ? 'rgba(255,255,255,0.35)' : brand.colors.black
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [ready, setReady] = useState(false)
  const resolvedHeight = height ?? mediaHeight(18, s)

  const fitImage = useCallback(() => {
    const container = containerRef.current
    const img = imgRef.current
    if (!container || !img || !img.naturalWidth) return
    applyCoverFit(img, container)
    setReady(true)
  }, [])

  useLayoutEffect(() => {
    fitImage()
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(() => fitImage())
    observer.observe(container)
    return () => observer.disconnect()
  }, [fitImage, resolvedHeight, width, stockIndex])

  return (
    <div style={{ position: 'relative', width }}>
      <BrandShape
        shape={4}
        size={56 * s}
        opacity={dark ? 0.28 : 0.18}
        style={{
          position: 'absolute',
          left: -12 * s,
          bottom: lh(3, s),
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      <div
        ref={containerRef}
        data-photo-module
        style={{
          position: 'relative',
          width: '100%',
          height: resolvedHeight,
          overflow: 'hidden',
          border: `${3 * s}px solid ${border}`,
          borderTop: 'none',
          background: dark ? '#111' : '#f0f0f0',
        }}
      >
        <ChromaticBars
          s={s}
          direction="horizontal"
          thickness={3 * s}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }}
        />
        <GeoCornerBrackets s={s} dark={dark} />
      <img
        ref={imgRef}
        src={getStockPhoto(stockIndex)}
        alt=""
        crossOrigin="anonymous"
        onLoad={fitImage}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: ready ? 1 : 0,
          display: 'block',
        }}
      />
      {showPartnerStrip && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            background: dark ? brand.colors.black : brand.colors.white,
            padding: `${10 * s}px ${16 * s}px`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          <ChromaticBars s={s} direction="horizontal" thickness={2 * s} style={{ marginBottom: 10 * s }} />
          <PartnerLockupStrip s={s} dark={dark} compact />
        </div>
      )}
      </div>
    </div>
  )
}

export function BodyText({ s, text, dark, maxWidth }: { s: number; text: string; dark?: boolean; maxWidth?: number }) {
  if (!text) return null
  return (
    <>
      <GeoSectionDivider s={s} style={{ marginTop: lh(1, s) }} />
      <p
        style={{
          fontSize: 24 * s,
          lineHeight: `${lh(1, s)}px`,
          marginTop: 0,
          maxWidth: maxWidth ? maxWidth * s : lh(28, s),
          opacity: dark ? 0.88 : 0.9,
          fontWeight: 400,
          minWidth: 0,
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        }}
      >
        {text}
      </p>
    </>
  )
}

export function Tagline({ s, text, dark }: { s: number; text: string; dark?: boolean }) {
  return (
    <div style={{ marginTop: lh(1, s), minWidth: 0 }}>
      <ChromaticBars
        s={s}
        direction="horizontal"
        thickness={Math.max(2, 2 * s)}
        length={bl(4, s)}
        style={{ marginBottom: bl(1, s), opacity: 0.9 }}
      />
      <p
        style={{
          fontSize: 24 * s,
          fontWeight: 600,
          lineHeight: `${lh(1, s)}px`,
          color: brand.colors.brightOrange,
          letterSpacing: '0.03em',
          opacity: dark ? 1 : 0.95,
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  )
}

export function BulletList({ s, items, dark }: { s: number; items: string[]; dark?: boolean }) {
  return (
    <ul
      style={{
        marginTop: lh(1, s),
        paddingLeft: lh(1, s),
        fontSize: 24 * s,
        lineHeight: `${lh(1, s)}px`,
        opacity: dark ? 0.9 : 0.85,
      }}
    >
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function CardGrid({
  s,
  cards,
  dark,
}: {
  s: number
  cards: { icon?: string; title: string; description?: string }[]
  dark?: boolean
}) {
  const cols = cards.length <= 2 ? cards.length : cards.length <= 4 ? 2 : 3
  return (
    <div
      style={{
        marginTop: lh(1, s),
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(cards.length, cols)}, minmax(0, 1fr))`,
        gap: gutter(s),
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      {cards.map((card, i) => (
        <div
          key={card.title}
          style={{
            position: 'relative',
            border: `${2 * s}px solid ${dark ? 'rgba(255,255,255,0.25)' : brand.colors.black}`,
            borderTop: 'none',
            padding: 16 * s,
            paddingTop: 12 * s,
            background: i % 2 === 0 ? (dark ? '#111' : brand.colors.white) : brand.colors.mutedYellow,
            color: brand.colors.black,
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <ChromaticBars
            s={s}
            direction="horizontal"
            thickness={2 * s}
            style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
          />
          {card.icon && <div style={{ fontSize: 28 * s }}>{card.icon}</div>}
          <div
            style={{
              fontFamily: brand.fonts.display,
              fontWeight: 700,
              fontSize: cards.length >= 5 ? 18 * s : 22 * s,
              marginTop: 8 * s,
              textTransform: 'uppercase',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}
          >
            {card.title}
          </div>
          {card.description && (
            <p
              style={{
                fontSize: cards.length >= 5 ? 14 * s : 16 * s,
                marginTop: 8 * s,
                lineHeight: 1.35,
                opacity: 0.85,
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
              }}
            >
              {card.description}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

export function StatsRow({
  s,
  stats,
  dark,
}: {
  s: number
  stats: { value: string; label: string }[]
  dark?: boolean
}) {
  const cols = Math.min(stats.length, stats.length > 4 ? 3 : stats.length > 3 ? 3 : stats.length)
  const valueSize = stats.length > 4 ? 64 * s : stats.length > 3 ? 72 * s : 96 * s

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: lh(1, s),
        marginTop: lh(2, s),
        minWidth: 0,
      }}
    >
      {stats.map((stat, i) => (
        <div key={stat.label} style={{ minWidth: 0, overflow: 'hidden' }}>
          <div
            style={{
              fontFamily: brand.fonts.display,
              fontSize: valueSize,
              fontWeight: 800,
              color: i % 2 === 0 ? brand.colors.mutedYellow : brand.colors.brightOrange,
              lineHeight: 1.05,
              overflowWrap: 'break-word',
            }}
          >
            {stat.value}
          </div>
          <ChromaticBars
            s={s}
            direction="horizontal"
            thickness={Math.max(2, 2 * s)}
            length={bl(5, s)}
            style={{ marginTop: 8 * s, marginBottom: 8 * s, opacity: 0.85 }}
          />
          <div
            style={{
              fontFamily: MONO,
              fontSize: 18 * s,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: 8 * s,
              opacity: dark ? 0.75 : 0.8,
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export function AgendaTimeline({
  s,
  items,
  dark = false,
}: {
  s: number
  items: AgendaItem[]
  dark?: boolean
}) {
  const timeColor = brand.colors.brightOrange
  const titleColor = dark ? brand.colors.white : brand.colors.black
  const descColor = dark ? 'rgba(255,255,255,0.65)' : '#666'
  const lineColor = brand.colors.burntOrange
  const rowBorder = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'

  return (
    <div style={{ marginTop: 40 * s, minWidth: 0, overflow: 'hidden' }}>
      {items.map((item, i) => (
        <div
          key={`${item.time}-${item.title}`}
          style={{
            display: 'grid',
            gridTemplateColumns: `${100 * s}px ${40 * s}px minmax(0, ${120 * s}px) minmax(0, 1fr)`,
            gap: `${8 * s}px ${12 * s}px`,
            alignItems: 'start',
            padding: `${18 * s}px 0`,
            borderBottom: i < items.length - 1 ? `${1 * s}px solid ${rowBorder}` : undefined,
          }}
        >
          <div
            style={{
              fontFamily: brand.fonts.display,
              fontSize: 24 * s,
              fontWeight: 800,
              color: timeColor,
              letterSpacing: '-0.02em',
              minWidth: 0,
              overflowWrap: 'break-word',
            }}
          >
            {item.time}
          </div>

          <div style={{ position: 'relative', height: '100%', minHeight: 40 * s, display: 'flex', justifyContent: 'center' }}>
            {i > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 2 * s,
                  height: '50%',
                  background: lineColor,
                }}
              />
            )}
            {i < items.length - 1 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 2 * s,
                  height: '50%',
                  background: lineColor,
                }}
              />
            )}
            <div
              style={{
                width: 14 * s,
                height: 14 * s,
                border: `${2 * s}px solid ${lineColor}`,
                background: dark ? brand.colors.black : brand.colors.white,
                transform: 'rotate(45deg)',
                position: 'relative',
                zIndex: 1,
                alignSelf: 'center',
                marginTop: 'auto',
                marginBottom: 'auto',
              }}
            />
          </div>

          <div
            style={{
              fontFamily: brand.fonts.display,
              fontSize: 22 * s,
              fontWeight: 700,
              color: titleColor,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              minWidth: 0,
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}
          >
            {item.title}
          </div>

          <div
            style={{
              fontSize: 18 * s,
              lineHeight: 1.4,
              color: descColor,
              minWidth: 0,
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}
          >
            {item.description}
          </div>
        </div>
      ))}
    </div>
  )
}

export function PartnerHeroMark({ s, label }: { s: number; label: string }) {
  if (label === 'AI') {
    return (
      <div
        style={{
          fontFamily: brand.fonts.display,
          fontSize: 160 * s,
          fontWeight: 800,
          color: brand.colors.mutedYellow,
          lineHeight: 0.9,
          letterSpacing: '-0.05em',
          textAlign: 'right',
          overflow: 'hidden',
        }}
      >
        AI
      </div>
    )
  }
  return null
}
