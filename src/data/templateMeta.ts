import campaignIndex from './campaign-index.json'
import type { CampaignAsset, CampaignPhase } from './types'
import { phaseLabels } from './types'
import { brand } from './brand'

export interface TemplateMeta {
  slug: string
  category: string
  title: string
  format: string
  dimensions: string
  photo_direction: string
}

export type TemplateMetaResolved = TemplateMeta & { templateTitle: string }

export interface TemplateVisualConfig {
  footerCta: string
  dark?: boolean
  /** Giant decorative number — background overlay or header accent */
  heroNumber?: string
  /** Top-right index display */
  indexLabel?: string
  layoutVariant?: 'poster' | 'social-giant' | 'square' | 'landscape' | 'landscape-dark' | 'landscape-partner' | 'signage' | 'countdown' | 'name-tag' | 'event-program' | 'ecosystem'
}

const templates = campaignIndex as TemplateMeta[]

export const templateMetaMap = Object.fromEntries(
  templates.map((t) => [t.slug, { ...t, templateTitle: t.title }]),
) as Record<string, TemplateMetaResolved>

const visualConfigs: Record<string, TemplateVisualConfig> = {
  'guildsa-buildathon01-poster': {
    footerCta: 'APPLY TO BUILD',
    indexLabel: '01',
    layoutVariant: 'poster',
  },
  'guildsa-buildathon01-announcement': {
    footerCta: 'BUILD AN AI-POWERED MVP',
    dark: true,
    heroNumber: String(brand.event.builders),
    indexLabel: '01',
    layoutVariant: 'poster',
  },
  'guildsa-applications-open': {
    footerCta: 'APPLY NOW',
    heroNumber: String(brand.event.builders),
    layoutVariant: 'social-giant',
  },
  'guildsa-first-100-builders': {
    footerCta: 'SECURE YOUR SPOT',
    heroNumber: String(brand.event.builders),
    layoutVariant: 'social-giant',
  },
  'guildsa-instagram-post-series': {
    footerCta: 'BUILD. SHIP. PROVE.',
    indexLabel: '4',
    layoutVariant: 'square',
  },
  'guildsa-instagram-carousel-series': {
    footerCta: 'SWIPE →',
    indexLabel: '5',
    layoutVariant: 'square',
  },
  'guildsa-linkedin-launch-series': {
    footerCta: 'PARTNER WITH THE ECOSYSTEM',
    dark: true,
    indexLabel: '01',
    layoutVariant: 'landscape-dark',
  },
  'guildsa-x-twitter-graphics': {
    footerCta: 'BUILD IN PUBLIC',
    heroNumber: '280',
    layoutVariant: 'landscape',
  },
  'guildsa-whatsapp-share-cards': {
    footerCta: 'SHARE WITH A BUILDER',
    layoutVariant: 'square',
  },
  'guildsa-countdown-30days': {
    footerCta: 'MARK YOUR CALENDAR',
    heroNumber: '30',
    layoutVariant: 'countdown',
  },
  'guildsa-countdown-14days': {
    footerCta: 'CONFIRM YOUR SEAT',
    heroNumber: '14',
    layoutVariant: 'countdown',
  },
  'guildsa-countdown-7days': {
    footerCta: 'SECURE YOUR PLACE',
    heroNumber: '7',
    layoutVariant: 'countdown',
  },
  'guildsa-countdown-3days': {
    footerCta: 'LAST CHANCE TO APPLY',
    heroNumber: '3',
    layoutVariant: 'countdown',
  },
  'guildsa-countdown-tomorrow': {
    footerCta: 'SEE YOU TOMORROW',
    heroNumber: '1',
    layoutVariant: 'countdown',
  },
  'guildsa-registration-closing-soon': {
    footerCta: 'APPLY NOW',
    layoutVariant: 'square',
  },
  'guildsa-eduvos-partner': {
    footerCta: 'INNOVATION NEEDS A PLACE TO EXECUTE',
    indexLabel: '01',
    layoutVariant: 'landscape-partner',
  },
  'guildsa-lovable-partner': {
    footerCta: 'FROM PROMPT TO PRODUCT',
    dark: true,
    heroNumber: 'AI',
    layoutVariant: 'landscape-partner',
  },
  'guildsa-veloztech-partner': {
    footerCta: 'INDUSTRY MEETS BUILDERS',
    indexLabel: '01',
    layoutVariant: 'landscape-partner',
  },
  'guildsa-become-a-sponsor': {
    footerCta: 'PARTNER WITH US',
    layoutVariant: 'poster',
  },
  'guildsa-sponsor-benefits': {
    footerCta: 'BACK THE BUILDERS',
    layoutVariant: 'landscape',
  },
  'guildsa-sponsor-impact': {
    footerCta: 'MEASURABLE IMPACT',
    layoutVariant: 'landscape',
  },
  'guildsa-challenge-partner-opportunities': {
    footerCta: 'SOLVE REAL PROBLEMS',
    layoutVariant: 'landscape',
  },
  'guildsa-become-a-mentor': {
    footerCta: 'APPLY TO MENTOR',
    layoutVariant: 'poster',
  },
  'guildsa-mentor-spotlight-template': {
    footerCta: 'MEET YOUR GUIDE',
    layoutVariant: 'square',
  },
  'guildsa-mentor-recruitment-poster': {
    footerCta: 'BECOME A MENTOR',
    layoutVariant: 'poster',
  },
  'guildsa-meet-the-founders': {
    footerCta: 'MEET THE TEAM',
    layoutVariant: 'square',
  },
  'guildsa-meet-the-builders': {
    footerCta: 'MEET THE BUILDERS',
    layoutVariant: 'square',
  },
  'guildsa-why-join-guild-sa': {
    footerCta: 'JOIN THE MOVEMENT',
    layoutVariant: 'social-giant',
  },
  'guildsa-builder-stories-template': {
    footerCta: 'FROM IDEA TO MVP',
    layoutVariant: 'square',
  },
  'guildsa-event-agenda-poster': {
    footerCta: 'RUN THE DAY LIKE A PRODUCT SPRINT',
    dark: true,
    heroNumber: '08:00',
    layoutVariant: 'event-program',
  },
  'guildsa-venue-wayfinding-signage': {
    footerCta: 'FOLLOW THE BUILDER ROUTE',
    indexLabel: '01',
    layoutVariant: 'signage',
  },
  'guildsa-registration-desk-graphics': {
    footerCta: 'CHECK IN HERE',
    layoutVariant: 'signage',
  },
  'guildsa-team-formation-poster': {
    footerCta: 'FORM YOUR TEAM',
    layoutVariant: 'poster',
  },
  'guildsa-judging-criteria-poster': {
    footerCta: 'HOW WE EVALUATE',
    layoutVariant: 'poster',
  },
  'guildsa-rules-guidelines-poster': {
    footerCta: 'READ BEFORE BUILD',
    layoutVariant: 'poster',
  },
  'guildsa-build-session-graphics': {
    footerCta: 'BUILD IN PROGRESS',
    layoutVariant: 'landscape',
  },
  'guildsa-demo-day-graphics': {
    footerCta: 'IDEAS BECOME PROOF',
    layoutVariant: 'landscape',
  },
  'guildsa-judges-graphics': {
    footerCta: 'INDUSTRY FEEDBACK',
    layoutVariant: 'landscape',
  },
  'guildsa-winner-graphics': {
    footerCta: 'TOP SOLUTIONS',
    layoutVariant: 'square',
  },
  'guildsa-awards-graphics': {
    footerCta: 'CELEBRATING BUILDERS',
    layoutVariant: 'landscape',
  },
  'guildsa-event-recap-poster': {
    footerCta: 'WHAT WE BUILT',
    layoutVariant: 'poster',
  },
  'guildsa-project-showcase-template': {
    footerCta: 'VIEW THE MVPS',
    layoutVariant: 'landscape',
  },
  'guildsa-sponsor-thank-you': {
    footerCta: 'TO OUR ECOSYSTEM',
    layoutVariant: 'square',
  },
  'guildsa-community-highlights': {
    footerCta: 'BUILDER MOMENTS',
    layoutVariant: 'square',
  },
  'guildsa-future-nodes-campaign': {
    footerCta: 'MORE NODES COMING',
    layoutVariant: 'poster',
  },
}

export function getTemplateMeta(slug: string): TemplateMetaResolved | undefined {
  return templateMetaMap[slug]
}

export function getVisualConfig(slug: string): TemplateVisualConfig {
  return (
    visualConfigs[slug] ?? {
      footerCta: 'APPLY TO BUILD',
      layoutVariant: 'poster',
    }
  )
}

export function titleToLines(title: string): string[] {
  return title.split('/').map((s) => s.trim()).filter(Boolean)
}

export function resolveHeadline(asset: CampaignAsset, _meta: TemplateMetaResolved): string[] {
  const c = asset.content.headline
  if (Array.isArray(c)) return c
  if (c) return [c]
  return []
}

export function resolveBody(asset: CampaignAsset, _meta: TemplateMetaResolved): string {
  const parts: string[] = []
  if (asset.content.subtext) parts.push(asset.content.subtext)
  if (asset.content.body) {
    parts.push(...(Array.isArray(asset.content.body) ? asset.content.body : [asset.content.body]))
  }
  return parts.join(' ')
}

export function resolveFooterCta(asset: CampaignAsset, visual: TemplateVisualConfig): string {
  return asset.content.cta ?? visual.footerCta
}

const GENERIC_EYEBROWS = ['GUILD SA / AI BUILDATHON 01']

function isGenericEyebrow(eyebrow?: string): boolean {
  if (!eyebrow) return true
  return GENERIC_EYEBROWS.some((g) => eyebrow.toUpperCase() === g.toUpperCase())
}

function headlinePrimary(content: CampaignAsset['content']): string {
  return Array.isArray(content.headline) ? content.headline.join(' ') : content.headline
}

function headlineFirstLine(content: CampaignAsset['content']): string {
  return Array.isArray(content.headline) ? content.headline[0] : content.headline
}

function bodyFirstLine(content: CampaignAsset['content']): string | undefined {
  if (!content.body) return undefined
  return Array.isArray(content.body) ? content.body[0] : content.body
}

function phaseCampaignName(phase: CampaignPhase): string {
  return phaseLabels[phase].split('—')[1]?.trim() ?? phaseLabels[phase]
}

function resolveHeaderSeries(content: CampaignAsset['content'], phase: CampaignPhase): string {
  return (
    content.tagline ??
    content.subtext?.split('.')[0]?.trim() ??
    bodyFirstLine(content) ??
    phaseCampaignName(phase)
  ).toUpperCase()
}

/** Center header column — campaign copy only, never production folios like "SLIDE 2 OF 7" */
export function resolveHeaderMeta(asset: CampaignAsset): { headerTag: string; headerSeries: string } {
  const { content, phase } = asset

  if (content.slideIndex && content.slideTotal) {
    const tag = !isGenericEyebrow(content.eyebrow) ? content.eyebrow! : headlineFirstLine(content)
    const series =
      (typeof content.body === 'string' ? content.body : undefined) ??
      content.subtext ??
      headlinePrimary(content) ??
      resolveHeaderSeries(content, phase)
    return {
      headerTag: tag.toUpperCase(),
      headerSeries: series.toUpperCase(),
    }
  }

  if (content.countdownDays !== undefined) {
    return {
      headerTag: headlinePrimary(content).toUpperCase(),
      headerSeries: (content.countdownMessage ?? content.subtext ?? 'THE COUNTDOWN BEGINS').toUpperCase(),
    }
  }

  if (Array.isArray(content.headline) && content.headline.length > 1 && !content.slideTotal) {
    return {
      headerTag: content.headline.join(' ').toUpperCase(),
      headerSeries: (
        content.countdownMessage ??
        content.tagline ??
        content.subtext ??
        content.cta ??
        phaseCampaignName(phase)
      ).toUpperCase(),
    }
  }

  if (content.eyebrow && !isGenericEyebrow(content.eyebrow)) {
    return {
      headerTag: content.eyebrow.toUpperCase(),
      headerSeries: resolveHeaderSeries(content, phase),
    }
  }

  return {
    headerTag: headlinePrimary(content).toUpperCase(),
    headerSeries: resolveHeaderSeries(content, phase),
  }
}

export function resolveIndex(asset: CampaignAsset, visual: TemplateVisualConfig): string {
  if (asset.content.slideIndex) return String(asset.content.slideIndex).padStart(2, '0')
  if (asset.content.countdownDays !== undefined) return String(asset.content.countdownDays)
  if (visual.indexLabel) return visual.indexLabel
  if (visual.heroNumber) return visual.heroNumber
  return '01'
}

export function resolveHeroNumber(asset: CampaignAsset, visual: TemplateVisualConfig): string | undefined {
  if (asset.content.countdownDays !== undefined) return String(asset.content.countdownDays)
  return visual.heroNumber
}

/** Body-only hero number — suppressed when the same value already appears in the header. */
export function resolveBodyHeroNumber(
  asset: CampaignAsset,
  visual: TemplateVisualConfig,
  headerShowsIndex: boolean,
): string | undefined {
  const hero = resolveHeroNumber(asset, visual)
  if (!hero) return undefined
  if (!headerShowsIndex) return hero
  if (hero === resolveIndex(asset, visual)) return undefined
  return hero
}

export function resolveLayoutVariant(slug: string, asset: CampaignAsset): TemplateVisualConfig['layoutVariant'] {
  if (asset.layout === 'name-tag') return 'name-tag'
  if (asset.layout === 'event-program') return 'event-program'
  if (asset.layout === 'bento-ecosystem') return 'ecosystem'
  const visual = getVisualConfig(slug)
  if (asset.content.cards && asset.content.cards.length >= 4) return 'landscape'
  if (asset.content.stats && asset.content.stats.length >= 4) return 'poster'
  return visual.layoutVariant ?? 'poster'
}
