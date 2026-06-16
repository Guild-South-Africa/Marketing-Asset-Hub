import { useSearchParams } from 'react-router-dom'
import { AssetGallery } from '../components/AssetGallery'
import { phaseLabels, phaseOrder, type CampaignPhase } from '../data/types'
import { templateCount } from '../data/assetRegistry'

export function GalleryPage() {
  const [params, setParams] = useSearchParams()
  const phase = (params.get('phase') as CampaignPhase | null) ?? 'all'

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold min-[414px]:text-3xl">Asset Gallery</h1>
        <p className="mt-2 text-sm text-zinc-400 sm:text-base">
          All campaign assets mapped to {templateCount} source templates. Click any asset to preview and export at full resolution.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterButton active={phase === 'all'} onClick={() => setParams({})}>
          All Phases
        </FilterButton>
        {phaseOrder.map((p) => (
          <FilterButton key={p} active={phase === p} onClick={() => setParams({ phase: p })}>
            {phaseLabels[p].split('—')[0]?.trim() ?? p}
          </FilterButton>
        ))}
      </div>

      <AssetGallery phaseFilter={phase === 'all' ? 'all' : phase} />
    </div>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition sm:px-4 sm:text-xs ${
        active
          ? 'bg-[#F4B12E] text-black'
          : 'border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}
