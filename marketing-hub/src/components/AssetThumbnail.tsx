import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { CampaignAsset } from '../data/types'
import { RenderModeProvider } from '../context/RenderModeContext'
import { useContainerWidth } from '../hooks/useContainerWidth'
import { AssetFrame } from './assets/AssetFrame'
import { AssetRenderer } from './assets/AssetRenderer'

interface AssetThumbnailProps {
  asset: CampaignAsset
}

const THUMBNAIL_MAX_WIDTH = 280

export function AssetThumbnail({ asset }: AssetThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previewWidth = useContainerWidth(containerRef, THUMBNAIL_MAX_WIDTH, THUMBNAIL_MAX_WIDTH)
  const ratio = asset.width / asset.height
  const previewHeight = previewWidth / ratio
  const cappedHeight = Math.min(previewHeight, 320)

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-[280px]">
      <div
        className="overflow-hidden bg-zinc-950"
        style={{ width: previewWidth, height: cappedHeight, maxWidth: '100%' }}
      >
        <RenderModeProvider mode="thumbnail">
          <AssetFrame asset={asset} previewWidth={previewWidth}>
            <AssetRenderer asset={asset} />
          </AssetFrame>
        </RenderModeProvider>
      </div>
    </div>
  )
}

interface AssetThumbnailLinkProps extends AssetThumbnailProps {
  to: string
  title: string
  assetNumber?: string
  channels: string[]
}

export function AssetThumbnailLink({ asset, to, title, assetNumber, channels }: AssetThumbnailLinkProps) {
  return (
    <Link
      to={to}
      className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition hover:border-[#E37226] hover:bg-zinc-900"
    >
      <div className="flex items-center justify-center overflow-hidden bg-zinc-950 p-2 sm:p-3">
        <AssetThumbnail asset={asset} />
      </div>
      <div className="p-3 sm:p-4">
        {assetNumber && (
          <span className="text-[10px] uppercase tracking-wider text-[#E37226]">Asset {assetNumber}</span>
        )}
        <h4 className="mt-1 line-clamp-2 text-sm font-medium text-white group-hover:text-[#F4B12E]">{title}</h4>
        <p className="mt-1 text-[11px] text-zinc-500 sm:text-xs">
          {asset.width}×{asset.height} · {channels.slice(0, 2).join(', ')}
        </p>
      </div>
    </Link>
  )
}
