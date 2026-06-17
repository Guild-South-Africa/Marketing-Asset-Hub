import { useRef } from 'react'
import type { CampaignAsset } from '../data/types'
import { RenderModeProvider } from '../context/RenderModeContext'
import { useContainerWidth } from '../hooks/useContainerWidth'
import { AssetFrame } from './assets/AssetFrame'
import { AssetRenderer } from './assets/AssetRenderer'
import { ExportButton } from './ExportButton'

interface AssetViewerProps {
  asset: CampaignAsset
}

const PREVIEW_MAX_WIDTH = 560

export function AssetViewer({ asset }: AssetViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const exportRef = useRef<HTMLDivElement>(null)
  const previewWidth = useContainerWidth(containerRef, PREVIEW_MAX_WIDTH, PREVIEW_MAX_WIDTH)

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.14em] text-[#E37226]">
            {asset.assetNumber ? `Asset ${asset.assetNumber}` : asset.phase.replace(/-/g, ' ')}
          </p>
          <h2 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">{asset.title}</h2>
          <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
            Coded design · {asset.width}×{asset.height}px · {asset.channels.join(', ')}
          </p>
        </div>
        <ExportButton asset={asset} exportRef={exportRef} className="w-full sm:w-auto" />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 sm:p-6">
        <p className="mb-3 text-xs uppercase tracking-wider text-zinc-500 sm:mb-4">
          Live preview — review below, then download when ready
        </p>
        <div ref={containerRef} className="flex w-full justify-center overflow-x-auto">
          <RenderModeProvider mode="full">
            <AssetFrame ref={exportRef} asset={asset} previewWidth={previewWidth}>
              <AssetRenderer asset={asset} />
            </AssetFrame>
          </RenderModeProvider>
        </div>
      </div>
    </div>
  )
}
