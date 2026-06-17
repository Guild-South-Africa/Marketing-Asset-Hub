import { marginX, lh, bl } from '../../data/gridSystem'
import { brand } from '../../data/brand'
import { brandAssets, getEduvosLogo, getGuildHeaderLogo, getLovableLogo, getVelozTechLogo } from '../../utils/assetPaths'
import { ChromaticBars } from './BrandDecor'

const MONO = "'Inter', ui-monospace, monospace"

interface LogoImageProps {
  src: string
  alt: string
  height?: number
  width?: number
  className?: string
  invert?: boolean
}

function LogoImage({ src, alt, height, width, className = '', invert = false }: LogoImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      crossOrigin="anonymous"
      style={{
        height: width ? 'auto' : height,
        width: width ?? 'auto',
        maxWidth: width ?? (height ? height * 5 : undefined),
        maxHeight: height,
        objectFit: 'contain',
        display: 'block',
        filter: invert ? 'invert(1)' : undefined,
      }}
    />
  )
}

/** Top-left GUILD SA lockup — Master Logo on light posters, Guild sa white on dark posters */
export function GuildHeaderLogo({ height = 56, dark = false }: { height?: number; dark?: boolean }) {
  return (
    <LogoImage src={getGuildHeaderLogo(dark)} alt="GUILD SA" height={height} />
  )
}

export function GuildMasterSymbol({ height = 48 }: { height?: number }) {
  return (
    <LogoImage src={brandAssets.guildMasterSymbol} alt="GUILD SA" height={height} />
  )
}

interface GuildLogoProps {
  variant?: 'full' | 'symbol' | 'header'
  className?: string
  height?: number
  dark?: boolean
}

export function GuildLogo({ variant = 'full', className = '', height = 48, dark = false }: GuildLogoProps) {
  if (variant === 'symbol') {
    return <GuildMasterSymbol height={height} />
  }
  if (variant === 'header') {
    return <GuildHeaderLogo height={height} dark={dark} />
  }
  return (
    <LogoImage
      src={getGuildHeaderLogo(dark)}
      alt="GUILD SA"
      height={height}
      className={className}
    />
  )
}

export function LovableLogo({
  height = 32,
  width,
  dark = false,
}: {
  height?: number
  width?: number
  dark?: boolean
}) {
  return <LogoImage src={getLovableLogo(dark)} alt="Lovable" height={height} width={width} />
}

export function VelozTechLogo({
  height = 32,
  width,
  dark = false,
}: {
  height?: number
  width?: number
  dark?: boolean
}) {
  return <LogoImage src={getVelozTechLogo(dark)} alt="VelozTech" height={height} width={width} />
}

export function EduvosLogo({
  height = 32,
  width,
  dark = false,
}: {
  height?: number
  width?: number
  dark?: boolean
}) {
  return <LogoImage src={getEduvosLogo(dark)} alt="Eduvos" height={height} width={width} />
}

/** Three-column partner bar — Lovable + Eduvos + VelozTech */
export function EcosystemPartnerBar({ s = 1 }: { s?: number }) {
  const logoHeight = 32 * s
  const labelColor = 'rgba(255,255,255,0.55)'
  const divider = 'rgba(255,255,255,0.15)'

  const partners = [
    {
      label: 'Ecosystem Partner',
      node: <LovableLogo height={logoHeight} dark />,
    },
    {
      label: 'Campus Partner',
      node: <EduvosLogo height={logoHeight} dark />,
    },
    {
      label: 'Strategic Partner',
      node: <VelozTechLogo height={logoHeight} dark />,
    },
  ]

  return (
    <div
      style={{
        marginTop: lh(2, s),
        background: brand.colors.black,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ChromaticBars s={s} direction="horizontal" thickness={bl(1, s)} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          alignItems: 'stretch',
        }}
      >
      {partners.map(({ label, node }, i) => (
        <div
          key={label}
          style={{
            padding: `${20 * s}px ${16 * s}px`,
            borderLeft: i > 0 ? `${1 * s}px solid ${divider}` : undefined,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10 * s,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 10 * s,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: labelColor,
            }}
          >
            {label}
          </span>
          {node}
        </div>
      ))}
      </div>
    </div>
  )
}

interface PartnerLockupStripProps {
  s?: number
  dark?: boolean
  compact?: boolean
}

/** VelozTech · Eduvos · Lovable partner row — shared height (native assets ~349px tall) */
export function PartnerLockupStrip({ s = 1, dark = false, compact = false }: PartnerLockupStripProps) {
  const labelColor = dark ? 'rgba(255,255,255,0.55)' : '#666'
  const partnerLogoHeight = (compact ? 18 : 26) * s
  const labelSize = (compact ? 9 : 11) * s
  const gap = (compact ? 6 : 8) * s

  const labelStyle = {
    fontFamily: MONO,
    fontSize: labelSize,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: labelColor,
    textAlign: 'center' as const,
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        alignItems: 'end',
        gap: compact ? 16 * s : 24 * s,
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap }}>
        <span style={{ ...labelStyle, textAlign: 'left' }}>Industry Innovation Partner</span>
        <VelozTechLogo height={partnerLogoHeight} dark={dark} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap }}>
        <span style={labelStyle}>Campus Partner</span>
        <EduvosLogo height={partnerLogoHeight} dark={dark} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap }}>
        <span style={{ ...labelStyle, textAlign: 'right' }}>AI Build Platform Partner</span>
        <LovableLogo height={partnerLogoHeight} dark={dark} />
      </div>
    </div>
  )
}

interface EcosystemLockupProps {
  s?: number
  dark?: boolean
}

/** Footer partner strip — VelozTech · Eduvos · Lovable (GUILD lives top-left) */
export function EcosystemLockup({ s = 1, dark = false }: EcosystemLockupProps) {
  const padX = marginX(s)

  return (
    <div
      style={{
        padding: `${20 * s}px ${padX}px`,
      }}
    >
      <PartnerLockupStrip s={s} dark={dark} />
    </div>
  )
}
