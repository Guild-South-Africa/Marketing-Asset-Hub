import { Link } from 'react-router-dom'
import { buildTimeline, campaignMilestones, getCampaignWindow } from '../data/timeline'
import type { Channel } from '../data/types'

const channelColors: Record<Channel, string> = {
  Instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  LinkedIn: 'bg-blue-600',
  WhatsApp: 'bg-green-600',
  'Campus Screens': 'bg-[#E37226]',
  'X/Twitter': 'bg-zinc-700',
  Print: 'bg-zinc-500',
  Signage: 'bg-[#F4B12E] text-black',
}

export function TimelineDashboard() {
  const timeline = buildTimeline()
  const window = getCampaignWindow()

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 sm:px-5">
        <p className="text-xs uppercase tracking-wider text-zinc-500">Posting window</p>
        <p className="mt-1 font-display text-base font-bold text-white sm:text-lg">
          {window.startLabel}
          <span className="mx-2 font-normal text-zinc-500">→</span>
          {window.endLabel}
          <span className="ml-2 text-sm font-normal text-zinc-500">({window.spanDays} days)</span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Campaign Starts', date: campaignMilestones.campaignStart },
          { label: 'Tease Phase Starts', date: campaignMilestones.teaseStart },
          { label: 'Registration Opens', date: campaignMilestones.registrationOpen },
          { label: 'Event Day', date: campaignMilestones.eventDate },
        ].map(({ label, date }) => (
          <div key={label} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
            <p className="mt-1 font-display text-lg font-bold text-[#F4B12E]">
              {date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-800 md:left-1/2" />

        <div className="space-y-6">
          {timeline.map((entry, i) => (
            <div
              key={entry.id}
              className={`relative flex flex-col gap-4 md:flex-row ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <div className="hidden md:block md:w-1/2" />
              <div
                className="absolute left-4 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[#F4B12E] bg-black md:left-1/2"
              />

              <div className="ml-8 min-[414px]:ml-10 md:ml-0 md:w-1/2">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 transition hover:border-zinc-700">
                  <div className="flex flex-wrap items-center gap-2">
                    <time className="text-xs font-medium text-[#E37226]">{entry.postDateLabel}</time>
                    <span className="text-xs text-zinc-600">
                      {entry.daysUntilEvent > 0
                        ? `${entry.daysUntilEvent}d to event`
                        : entry.daysUntilEvent === 0
                          ? 'Event day'
                          : `${Math.abs(entry.daysUntilEvent)}d after event`}
                    </span>
                  </div>

                  <Link to={`/assets/${entry.assetId}`} className="mt-2 block group">
                    <h4 className="font-display text-base font-bold text-white group-hover:text-[#F4B12E]">
                      {entry.title}
                    </h4>
                  </Link>

                  <p className="mt-1 text-xs text-zinc-500">{entry.phaseLabel}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {entry.channels.map((ch) => (
                      <span
                        key={ch}
                        className={`rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white ${channelColors[ch]}`}
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
