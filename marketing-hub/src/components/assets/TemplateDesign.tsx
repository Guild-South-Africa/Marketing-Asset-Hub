import type { CampaignAsset } from '../../data/types'
import { brand } from '../../data/brand'
import { gutter, lh, marginX, mediaHeight } from '../../data/gridSystem'
import {
  getTemplateMeta,
  getVisualConfig,
  resolveBody,
  resolveBodyHeroNumber,
  resolveFooterCta,
  resolveHeadline,
  resolveHeroNumber,
  resolveIndex,
  resolveBackdrop,
  resolveLayoutVariant,
  shouldShowEyebrow,
} from '../../data/templateMeta'
import { EcosystemLockup, EcosystemPartnerBar } from './BrandElements'
import { canvasBodyStyle, indexFontSize } from './layoutUtils'
import {
  AgendaTimeline,
  BodyText,
  BulletList,
  CardGrid,
  DesignCanvas,
  EyebrowLabel,
  GiantBackgroundNumber,
  MetaFooter,
  MetaHeader,
  PartnerHeroMark,
  PhotoModule,
  StackedHeadline,
  StatsRow,
  Tagline,
  scale,
} from './grid/TemplateGrid'

interface TemplateDesignProps {
  asset: CampaignAsset
}

const bodyGrid = (s: number) =>
  ({
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    columnGap: gutter(s),
  }) as const

export function TemplateDesign({ asset }: TemplateDesignProps) {
  const meta = getTemplateMeta(asset.templateSlug)
  if (!meta) return null

  const visual = getVisualConfig(asset.templateSlug)
  const s = scale(asset.width)
  const backdrop = resolveBackdrop(asset)
  const configDark = visual.dark ?? asset.content.dark ?? false
  const dark = backdrop === 'threejs' || configDark
  const headline = resolveHeadline(asset, meta)
  const body = resolveBody(asset, meta)
  const cta = resolveFooterCta(asset, visual)
  const index = resolveIndex(asset, visual)
  const heroNumber = resolveHeroNumber(asset, visual)
  const bodyHeroNumber = resolveBodyHeroNumber(asset, visual, true)
  const backgroundHeroNumber = resolveBodyHeroNumber(asset, visual, false)
  const variant = resolveLayoutVariant(asset.templateSlug, asset)
  const canvasDark = dark || variant === 'landscape-dark'

  const padX = marginX(s)
  const canvasBase = {
    width: asset.width,
    height: asset.height,
    backdrop,
    backdropSeed: asset.stockIndex ?? 0,
  } as const

  switch (variant) {
    case 'social-giant':
      return (
        <DesignCanvas {...canvasBase} dark={dark}>
          <MetaHeader s={s} dark={dark} />
          <div style={canvasBodyStyle({ padding: `${lh(1, s)}px ${padX}px`, position: 'relative' })}>
            {backgroundHeroNumber && (
              <GiantBackgroundNumber s={s} value={backgroundHeroNumber} dark={dark} />
            )}
            <div style={{ ...bodyGrid(s), position: 'relative', zIndex: 1, minHeight: 0, height: '100%' }}>
              <div style={{ gridColumn: '1 / 8', minWidth: 0 }}>
                {shouldShowEyebrow(asset.content.eyebrow) && (
                  <EyebrowLabel s={s} text={asset.content.eyebrow!} dark={dark} />
                )}
                <StackedHeadline s={s} lines={headline} size={96} dark={dark} />
                <BodyText s={s} text={body} dark={dark} />
                {asset.content.tagline && <Tagline s={s} text={asset.content.tagline} dark={dark} />}
              </div>
              <div style={{ gridColumn: '8 / 13', alignSelf: 'end' }}>
                <PhotoModule s={s} stockIndex={asset.stockIndex} height={mediaHeight(20, s)} dark={dark} />
              </div>
            </div>
          </div>
          <MetaFooter s={s} dark={dark} cta={cta} />
        </DesignCanvas>
      )

    case 'countdown':
      return (
        <DesignCanvas {...canvasBase} dark={dark}>
          <MetaHeader
            s={s}
            dark={dark}
            index={heroNumber}
          />
          <div style={canvasBodyStyle({ padding: `${lh(1, s)}px ${padX}px` })}>
            <StackedHeadline s={s} lines={headline} size={72} dark={dark} />
            {asset.content.countdownMessage && (
              <BodyText s={s} text={asset.content.countdownMessage} dark={dark} />
            )}
            <div style={{ marginTop: lh(1, s) }}>
              <PhotoModule s={s} stockIndex={asset.stockIndex} height={mediaHeight(16, s)} dark={dark} />
            </div>
          </div>
          <MetaFooter s={s} dark={dark} cta={cta} />
        </DesignCanvas>
      )

    case 'square':
      return (
        <DesignCanvas {...canvasBase} dark={dark}>
          <MetaHeader
            s={s}
            dark={dark}
            index={visual.indexLabel}
          />
          <div style={canvasBodyStyle({ padding: `${lh(1, s)}px ${padX}px`, display: 'flex', flexDirection: 'column' })}>
            {shouldShowEyebrow(asset.content.eyebrow) && (
              <EyebrowLabel s={s} text={asset.content.eyebrow!} dark={dark} />
            )}
            <StackedHeadline s={s} lines={headline} size={80} dark={dark} />
            <BodyText s={s} text={body} dark={dark} maxWidth={720} />
            {asset.content.list && <BulletList s={s} items={asset.content.list} dark={dark} />}
            <div style={{ marginTop: 'auto', paddingTop: lh(1, s) }}>
              <PhotoModule s={s} stockIndex={asset.stockIndex} height={mediaHeight(15, s)} dark={dark} />
            </div>
          </div>
          <MetaFooter s={s} dark={dark} cta={cta} />
        </DesignCanvas>
      )

    case 'ecosystem':
      return (
        <DesignCanvas {...canvasBase} dark>
          <MetaHeader
            s={s}
            dark
            index={index}
          />
          <div style={canvasBodyStyle({ padding: `${lh(1, s)}px ${padX}px`, ...bodyGrid(s) })}>
            <div style={{ gridColumn: '1 / 7', display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
              {shouldShowEyebrow(asset.content.eyebrow) && (
                <EyebrowLabel s={s} text={asset.content.eyebrow!} dark />
              )}
              {headline[0] && (
                <StackedHeadline s={s} lines={[headline[0]]} size={72} dark />
              )}
              {headline[1] && (
                <h1
                  style={{
                    fontFamily: brand.fonts.display,
                    fontSize: 72 * s,
                    fontWeight: 800,
                    lineHeight: `${lh(3, s)}px`,
                    letterSpacing: '-0.03em',
                    textTransform: 'uppercase',
                    margin: 0,
                    color: brand.colors.white,
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                  }}
                >
                  {headline[1]}
                </h1>
              )}
              {headline.length > 2 && <StackedHeadline s={s} lines={headline.slice(2)} size={72} dark />}
              <BodyText s={s} text={body} dark maxWidth={720} />
              {asset.content.tagline && <Tagline s={s} text={asset.content.tagline} dark />}
              <div style={{ marginTop: 'auto' }}>
                <EcosystemPartnerBar s={s} />
              </div>
            </div>
            <div style={{ gridColumn: '7 / 13', alignSelf: 'stretch', minHeight: mediaHeight(14, s) }}>
              <PhotoModule s={s} stockIndex={asset.stockIndex} height={mediaHeight(14, s)} dark />
            </div>
          </div>
          <MetaFooter s={s} dark cta={cta} showPartnerLockup={false} />
        </DesignCanvas>
      )

    case 'landscape-dark':
    case 'landscape':
      return (
        <DesignCanvas {...canvasBase} dark={canvasDark}>
          <MetaHeader
            s={s}
            dark={canvasDark}
            index={index}
          />
          <div style={canvasBodyStyle({ padding: `${lh(1, s)}px ${padX}px`, ...bodyGrid(s) })}>
            <div style={{ gridColumn: asset.content.cards ? '1 / 13' : '1 / 7', minWidth: 0, overflow: 'hidden' }}>
              {shouldShowEyebrow(asset.content.eyebrow) && (
                <EyebrowLabel s={s} text={asset.content.eyebrow!} dark={canvasDark} />
              )}
              <StackedHeadline
                s={s}
                lines={headline}
                size={asset.content.cards ? 48 : 64}
                dark={canvasDark}
              />
              <BodyText s={s} text={body} dark={canvasDark} maxWidth={820} />
              {asset.content.list && <BulletList s={s} items={asset.content.list} dark={canvasDark} />}
              {asset.content.stats && <StatsRow s={s} stats={asset.content.stats} dark={canvasDark} />}
              {asset.content.cards && <CardGrid s={s} cards={asset.content.cards} dark={canvasDark} />}
            </div>
            {!asset.content.cards && (
              <div style={{ gridColumn: '7 / 13', display: 'flex', flexDirection: 'column', gap: lh(1, s), minWidth: 0, overflow: 'hidden' }}>
                <PhotoModule s={s} stockIndex={asset.stockIndex} height={mediaHeight(17, s)} dark={canvasDark} />
              </div>
            )}
          </div>
          <MetaFooter s={s} dark={canvasDark} cta={cta} />
        </DesignCanvas>
      )

    case 'landscape-partner': {
      const isLovable = asset.templateSlug.includes('lovable')
      return (
        <DesignCanvas {...canvasBase} dark={dark}>
          <MetaHeader s={s} dark={dark} />
          <div style={canvasBodyStyle({ padding: `${lh(1, s)}px ${padX}px`, ...bodyGrid(s) })}>
            <div style={{ gridColumn: '1 / 7', paddingTop: lh(1, s), minWidth: 0 }}>
              <StackedHeadline s={s} lines={headline} size={isLovable ? 88 : 72} dark={dark} />
              <BodyText s={s} text={body} dark={dark} />
              {asset.content.list && <BulletList s={s} items={asset.content.list} dark={dark} />}
            </div>
            <div style={{ gridColumn: '7 / 13', minWidth: 0, overflow: 'hidden' }}>
              {!isLovable && index && (
                <div
                  style={{
                    textAlign: 'right',
                    fontFamily: brand.fonts.display,
                    fontSize: indexFontSize(index, s) * 0.88,
                    fontWeight: 800,
                    color: brand.colors.mutedYellow,
                    lineHeight: 1,
                    marginBottom: lh(1, s),
                  }}
                >
                  {index}
                </div>
              )}
              {isLovable && <PartnerHeroMark s={s} label="AI" />}
              <PhotoModule
                s={s}
                stockIndex={asset.stockIndex}
                height={mediaHeight(16, s)}
                dark={dark}
                showPartnerStrip={isLovable}
              />
            </div>
          </div>
          <MetaFooter s={s} dark={dark} cta={cta} />
        </DesignCanvas>
      )
    }

    case 'signage':
      return (
        <DesignCanvas {...canvasBase} dark={dark}>
          <MetaHeader s={s} dark={dark} index={index} />
          <div style={canvasBodyStyle({ padding: `${lh(2, s)}px ${padX}px`, display: 'flex', flexDirection: 'column' })}>
            <StackedHeadline s={s} lines={headline} size={120} dark={dark} />
            <BodyText s={s} text={body} maxWidth={900} dark={dark} />
            {asset.content.location && (
              <p
                style={{
                  marginTop: lh(1, s),
                  fontSize: 28 * s,
                  lineHeight: `${lh(1, s)}px`,
                  opacity: 0.7,
                  letterSpacing: '0.06em',
                  color: dark ? brand.colors.white : brand.colors.black,
                }}
              >
                {asset.content.location}
              </p>
            )}
            <div style={{ marginTop: 'auto', paddingTop: lh(2, s) }}>
              <PhotoModule s={s} stockIndex={asset.stockIndex} height={mediaHeight(30, s)} dark={dark} />
            </div>
          </div>
          <MetaFooter s={s} dark={dark} cta={cta} />
        </DesignCanvas>
      )

    case 'name-tag':
      return (
        <DesignCanvas {...canvasBase} dark={dark}>
          <MetaHeader s={s} dark={dark} />
          <div style={canvasBodyStyle({ display: 'flex', alignItems: 'center', padding: `0 ${padX}px` })}>
            <div style={{ flex: 1 }}>
              <StackedHeadline s={s} lines={headline} size={48} dark={dark} />
              {body && <BodyText s={s} text={body} dark={dark} />}
            </div>
          </div>
          <EcosystemLockup s={s} dark={dark} />
        </DesignCanvas>
      )

    case 'event-program':
      return (
        <DesignCanvas {...canvasBase} dark>
          <MetaHeader
            s={s}
            dark
            index={heroNumber ?? index}
          />
          <div style={canvasBodyStyle({ padding: `${lh(1, s)}px ${padX}px`, ...bodyGrid(s) })}>
            <div style={{ gridColumn: '1 / 8', minWidth: 0, overflow: 'hidden' }}>
              <StackedHeadline s={s} lines={headline} size={asset.content.agenda ? 72 : 112} dark />
              {asset.content.agenda && <AgendaTimeline s={s} items={asset.content.agenda} dark />}
            </div>
            <div style={{ gridColumn: '8 / 13', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <PhotoModule s={s} stockIndex={asset.stockIndex} height={mediaHeight(20, s)} dark />
            </div>
          </div>
          <MetaFooter s={s} dark cta={cta} />
        </DesignCanvas>
      )

    case 'poster':
    default:
      return (
        <DesignCanvas {...canvasBase} dark={dark}>
          <MetaHeader s={s} dark={dark} index={index} />
          <div style={canvasBodyStyle({ padding: `${lh(1, s)}px ${padX}px`, ...bodyGrid(s), position: 'relative' })}>
            <div style={{ gridColumn: '1 / 7', minWidth: 0, overflow: 'hidden' }}>
              {shouldShowEyebrow(asset.content.eyebrow) && (
                <EyebrowLabel s={s} text={asset.content.eyebrow!} dark={dark} />
              )}
              <StackedHeadline s={s} lines={headline} size={112} dark={dark} />
              <BodyText s={s} text={body} dark={dark} />
              {asset.content.tagline && <Tagline s={s} text={asset.content.tagline} dark={dark} />}
              {asset.content.list && <BulletList s={s} items={asset.content.list} dark={dark} />}
              {asset.content.stats && <StatsRow s={s} stats={asset.content.stats} dark={dark} />}
            </div>
            <div style={{ gridColumn: '7 / 13', alignSelf: 'end', position: 'relative', minWidth: 0 }}>
              {dark && bodyHeroNumber && (
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: -20 * s,
                    fontFamily: brand.fonts.display,
                    fontSize: 180 * s,
                    fontWeight: 800,
                    color: brand.colors.mutedYellow,
                    opacity: 0.28,
                    lineHeight: 0.9,
                    pointerEvents: 'none',
                    zIndex: 0,
                    textAlign: 'right',
                    overflow: 'hidden',
                    maxWidth: '100%',
                  }}
                >
                  {bodyHeroNumber}
                </div>
              )}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <PhotoModule s={s} stockIndex={asset.stockIndex} height={mediaHeight(22, s)} dark={dark} />
              </div>
            </div>
          </div>
          <MetaFooter s={s} dark={dark} cta={cta} />
        </DesignCanvas>
      )
  }
}
