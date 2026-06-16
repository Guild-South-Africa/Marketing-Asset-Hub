import { forwardRef, type ReactNode } from 'react'
import type { CampaignAsset } from '../../data/types'

interface AssetFrameProps {
  asset: CampaignAsset
  previewWidth: number
  children: ReactNode
}

export const AssetFrame = forwardRef<HTMLDivElement, AssetFrameProps>(
  function AssetFrame({ asset, previewWidth, children }, ref) {
    const scale = previewWidth / asset.width
    const previewHeight = asset.height * scale

    return (
      <div
        className="relative overflow-hidden rounded-lg shadow-2xl ring-1 ring-black/10"
        style={{ width: previewWidth, height: previewHeight }}
      >
        <div
          ref={ref}
          data-export-root
          style={{
            width: asset.width,
            height: asset.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    )
  },
)
