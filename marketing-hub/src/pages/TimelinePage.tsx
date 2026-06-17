import { TimelineDashboard } from '../components/TimelineDashboard'
import { brand } from '../data/brand'

export function TimelinePage() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold min-[414px]:text-3xl">Campaign Timeline</h1>
        <p className="mt-2 text-sm text-zinc-400 sm:text-base">
          Posting schedule from tomorrow through {brand.event.date}. Pre-event assets are spread across the window;
          event-week and print assets land on event day.
        </p>
      </div>
      <TimelineDashboard />
    </div>
  )
}
