export type CampaignPhase =
  | 'pre-campaign'
  | 'phase-01-tease'
  | 'phase-02-credibility'
  | 'phase-03-registration'
  | 'phase-04-event'
  | 'phase-05-post'
  | 'physical'

export type Channel =
  | 'Instagram'
  | 'LinkedIn'
  | 'WhatsApp'
  | 'Campus Screens'
  | 'X/Twitter'
  | 'Print'
  | 'Signage'

export type LayoutVariant =
  | 'editorial-poster'
  | 'editorial-social'
  | 'editorial-square'
  | 'editorial-landscape'
  | 'editorial-signage'
  | 'carousel-slide'
  | 'countdown'
  | 'partner-card'
  | 'stats-grid'
  | 'bento-ecosystem'
  | 'challenge-list'
  | 'showcase-card'
  | 'storyboard'
  | 'numbers-hero'
  | 'name-tag'
  | 'event-program'

export interface AgendaItem {
  time: string
  title: string
  description: string
}

export interface AssetContent {
  eyebrow?: string
  headline: string | string[]
  subtext?: string
  body?: string | string[]
  list?: string[]
  agenda?: AgendaItem[]
  cards?: { icon?: string; title: string; description?: string }[]
  cta?: string
  date?: string
  location?: string
  tagline?: string
  accent?: 'burntOrange' | 'brightOrange' | 'solidYellow' | 'mutedYellow'
  slideIndex?: number
  slideTotal?: number
  countdownDays?: number
  countdownMessage?: string
  stats?: { value: string; label: string }[]
  dark?: boolean
}

export interface CampaignAsset {
  id: string
  slug: string
  templateSlug: string
  title: string
  phase: CampaignPhase
  phaseLabel: string
  assetNumber?: string
  channels: Channel[]
  width: number
  height: number
  format: string
  layout: LayoutVariant
  content: AssetContent
  stockIndex: number
  postOffsetDays: number
}

export const phaseLabels: Record<CampaignPhase, string> = {
  'pre-campaign': 'Pre-Campaign — The Builder Movement Begins',
  'phase-01-tease': 'Phase 01 — The Tease',
  'phase-02-credibility': 'Phase 02 — Credibility & Social Proof',
  'phase-03-registration': 'Phase 03 — Registration Campaign',
  'phase-04-event': 'Phase 04 — Event Week',
  'phase-05-post': 'Phase 05 — After The Event',
  physical: 'Physical & Print Assets',
}

export const phaseOrder: CampaignPhase[] = [
  'pre-campaign',
  'phase-01-tease',
  'phase-02-credibility',
  'phase-03-registration',
  'phase-04-event',
  'phase-05-post',
  'physical',
]
