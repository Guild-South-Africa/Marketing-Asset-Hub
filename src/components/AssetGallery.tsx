import { assetRegistry } from '../data/assetRegistry'
import { phaseLabels, phaseOrder, type CampaignPhase } from '../data/types'
import { AssetThumbnailLink } from './AssetThumbnail'

interface AssetGalleryProps {
  phaseFilter?: CampaignPhase | 'all'
}

export function AssetGallery({ phaseFilter = 'all' }: AssetGalleryProps) {
  const filtered =
    phaseFilter === 'all' ? assetRegistry : assetRegistry.filter((a) => a.phase === phaseFilter)

  return (
    <div className="space-y-8">
      {phaseOrder.map((phase) => {
        const items = filtered.filter((a) => a.phase === phase)
        if (items.length === 0) return null

        return (
          <section key={phase}>
            <h3 className="mb-4 font-display text-lg font-bold text-[#F4B12E]">{phaseLabels[phase]}</h3>
            <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((asset) => (
                <AssetThumbnailLink
                  key={asset.id}
                  asset={asset}
                  to={`/assets/${asset.id}`}
                  title={asset.title}
                  assetNumber={asset.assetNumber}
                  channels={asset.channels}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
