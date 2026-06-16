import { Link, useParams } from 'react-router-dom'
import { AssetViewer } from '../components/AssetViewer'
import { getAssetById } from '../data/assetRegistry'
import { phaseLabels } from '../data/types'

export function AssetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const asset = id ? getAssetById(id) : undefined

  if (!asset) {
    return (
      <div className="py-20 text-center">
        <p className="text-zinc-400">Asset not found.</p>
        <Link to="/gallery" className="mt-4 inline-block text-[#E37226] hover:underline">
          Back to gallery
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <Link to="/gallery" className="inline-block text-sm text-zinc-500 hover:text-[#F4B12E]">
        ← Back to gallery
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 sm:p-6">
        <p className="text-xs uppercase tracking-wider text-zinc-500">{phaseLabels[asset.phase]}</p>
        <AssetViewer asset={asset} />
      </div>
    </div>
  )
}
