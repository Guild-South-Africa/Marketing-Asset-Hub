import { brand } from './brand'
import { assetRegistry } from './assetRegistry'
import type { CampaignAsset } from './types'
import { phaseLabels, phaseOrder, type CampaignPhase, type Channel } from './types'

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

const PRE_EVENT_PHASES: CampaignPhase[] = [
  'pre-campaign',
  'phase-01-tease',
  'phase-02-credibility',
  'phase-03-registration',
]

function startOfTomorrow(): Date {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(9, 0, 0, 0)
  return d
}

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

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function clampDate(date: Date, min: Date, max: Date): Date {
  if (date.getTime() < min.getTime()) return new Date(min)
  if (date.getTime() > max.getTime()) return new Date(max)
  return date
}

/** Preserve campaign phase order, then original offset within each phase */
function assetScheduleRank(asset: CampaignAsset): number {
  const phaseIndex = phaseOrder.indexOf(asset.phase)
  return phaseIndex * 1000 + asset.postOffsetDays
}

/** Spread pre-event posts from tomorrow through the day before the event */
function resolvePreEventDate(index: number, total: number, campaignStart: Date): Date {
  if (total <= 1) return new Date(campaignStart)

  const lastPreEventDay = addDays(EVENT_DATE, -1)
  const spanDays = Math.max(0, daysBetween(campaignStart, lastPreEventDay))
  const dayOffset = Math.round((index / (total - 1)) * spanDays)
  return addDays(campaignStart, dayOffset)
}

export function getCampaignWindow() {
  const start = startOfTomorrow()
  return {
    start,
    startLabel: formatDate(start),
    end: EVENT_DATE,
    endLabel: formatDate(EVENT_DATE),
    spanDays: Math.max(0, daysBetween(start, EVENT_DATE)),
  }
}

export function buildTimeline(): TimelineEntry[] {
  const campaignStart = startOfTomorrow()
  const sorted = [...assetRegistry].sort((a, b) => assetScheduleRank(a) - assetScheduleRank(b))
  const preEvent = sorted.filter((a) => PRE_EVENT_PHASES.includes(a.phase))
  const onEventDay = sorted.filter((a) => !PRE_EVENT_PHASES.includes(a.phase))

  const postDateByAssetId = new Map<string, Date>()

  preEvent.forEach((asset, index) => {
    postDateByAssetId.set(asset.id, resolvePreEventDate(index, preEvent.length, campaignStart))
  })

  onEventDay.forEach((asset) => {
    postDateByAssetId.set(asset.id, new Date(EVENT_DATE))
  })

  return sorted
    .map((asset, orderIndex) => {
      const postDate = clampDate(postDateByAssetId.get(asset.id) ?? campaignStart, campaignStart, EVENT_DATE)
      return {
        orderIndex,
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
    .sort((a, b) => a.postDate.getTime() - b.postDate.getTime() || a.orderIndex - b.orderIndex)
    .map(({ orderIndex: _, ...entry }) => entry)
}

export const campaignMilestones = (() => {
  const start = startOfTomorrow()
  const registration = clampDate(REGISTRATION_DATE, start, EVENT_DATE)
  const preCampaign = clampDate(addDays(registration, -10), start, registration)
  const tease = clampDate(addDays(registration, -21), start, preCampaign)

  return {
    campaignStart: start,
    campaignStartLabel: formatDate(start),
    eventDate: EVENT_DATE,
    eventDateLabel: formatDate(EVENT_DATE),
    registrationOpen: registration,
    registrationOpenLabel: formatDate(registration),
    preCampaignStart: preCampaign,
    preCampaignStartLabel: formatDate(preCampaign),
    teaseStart: tease,
    teaseStartLabel: formatDate(tease),
  }
})()

export { EVENT_DATE, REGISTRATION_DATE }
