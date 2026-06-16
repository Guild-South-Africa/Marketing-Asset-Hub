import { brand } from './brand'
import { assetRegistry } from './assetRegistry'
import type { CampaignAsset } from './types'
import { phaseLabels, type CampaignPhase, type Channel } from './types'

export interface TimelineEntry {
  id: string
  assetId: string
  title: string
  phase: CampaignPhase
  phaseLabel: string
  channels: Channel[]
  postDate: Date
  postDateLabel: string
  daysUntilEvent: number
  templateSlug: string
  assetNumber?: string
}

const EVENT_DATE = new Date(`${brand.event.dateISO}T09:00:00`)
const REGISTRATION_DATE = new Date(`${brand.registrationOpenISO}T09:00:00`)

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-ZA', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

function resolvePostDate(asset: CampaignAsset): Date {
  const eventPhases: CampaignAsset['phase'][] = ['phase-04-event', 'phase-05-post', 'physical']
  const useEventDate =
    eventPhases.includes(asset.phase) ||
    asset.layout === 'countdown' ||
    asset.id.includes('countdown')

  const base = useEventDate
    ? EVENT_DATE
    : asset.phase === 'phase-03-registration' && asset.postOffsetDays >= 0
      ? REGISTRATION_DATE
      : REGISTRATION_DATE

  const date = new Date(base)
  date.setDate(date.getDate() + asset.postOffsetDays)
  return date
}

export function buildTimeline(): TimelineEntry[] {
  return assetRegistry
    .map((asset) => {
      const postDate = resolvePostDate(asset)
      return {
        id: `tl-${asset.id}`,
        assetId: asset.id,
        title: asset.title,
        phase: asset.phase,
        phaseLabel: phaseLabels[asset.phase],
        channels: asset.channels,
        postDate,
        postDateLabel: formatDate(postDate),
        daysUntilEvent: daysBetween(postDate, EVENT_DATE),
        templateSlug: asset.templateSlug,
        assetNumber: asset.assetNumber,
      }
    })
    .sort((a, b) => a.postDate.getTime() - b.postDate.getTime())
}

export const campaignMilestones = {
  eventDate: EVENT_DATE,
  eventDateLabel: formatDate(EVENT_DATE),
  registrationOpen: REGISTRATION_DATE,
  registrationOpenLabel: formatDate(REGISTRATION_DATE),
  preCampaignStart: (() => {
    const d = new Date(REGISTRATION_DATE)
    d.setDate(d.getDate() - 10)
    return d
  })(),
  teaseStart: (() => {
    const d = new Date(REGISTRATION_DATE)
    d.setDate(d.getDate() - 21)
    return d
  })(),
}

export { EVENT_DATE, REGISTRATION_DATE }
