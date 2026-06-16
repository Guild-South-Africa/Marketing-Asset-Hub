import { Link } from 'react-router-dom'
import { assetRegistry, templateCount } from '../data/assetRegistry'
import { campaignMilestones } from '../data/timeline'
import { phaseLabels, phaseOrder } from '../data/types'
import { brand } from '../data/brand'

export function DashboardPage() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 p-6 sm:p-8 md:p-12">
        <div className="absolute right-0 top-0 h-64 w-64 bg-[#E37226]/10 blur-3xl" />
        <p className="text-xs uppercase tracking-[0.2em] text-[#F4B12E]">GUILD SA AI Buildathon 01</p>
        <h1 className="mt-3 max-w-3xl font-display text-2xl font-extrabold leading-tight min-[414px]:text-3xl sm:text-4xl md:text-5xl">
          Marketing Asset Generator & Hub
        </h1>
        <p className="mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
          Bold, minimal, urgent. No MVP = No Judgement. Generate production-ready campaign assets mapped to
          all {templateCount} design templates — sized exactly, exportable at full resolution.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/gallery"
            className="rounded-md bg-[#E37226] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#FE980F]"
          >
            Browse Asset Gallery
          </Link>
          <Link
            to="/timeline"
            className="rounded-md border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-white hover:border-[#F4B12E]"
          >
            View Campaign Timeline
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Assets', value: assetRegistry.length },
          { label: 'Templates Mapped', value: templateCount },
          { label: 'Event Date', value: brand.event.date },
          { label: 'Registration Opens', value: campaignMilestones.registrationOpenLabel },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-[#F4B12E]">{value}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl font-bold">Campaign Phases</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {phaseOrder.map((phase) => {
            const count = assetRegistry.filter((a) => a.phase === phase).length
            return (
              <Link
                key={phase}
                to={`/gallery?phase=${phase}`}
                className="rounded-xl border border-zinc-800 p-4 transition hover:border-[#E37226] hover:bg-zinc-900/50"
              >
                <p className="text-xs text-[#E37226]">{count} assets</p>
                <p className="mt-1 text-sm font-medium text-white">{phaseLabels[phase]}</p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="font-display text-lg font-bold text-[#F4B12E]">Brand System</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {Object.entries(brand.colors).map(([name, hex]) => (
            <div key={name} className="flex items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2">
              <span className="h-6 w-6 rounded-full border border-zinc-700" style={{ background: hex }} />
              <span className="text-xs text-zinc-400">{name}</span>
              <span className="font-mono text-xs text-zinc-600">{hex}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-zinc-500">
          Typography: Rubik (display) · Geist/Inter (UI). GUILD SA logo with 1.2× clearspace. Lovable as AI Build Platform Partner on every asset.
        </p>
      </section>
    </div>
  )
}
