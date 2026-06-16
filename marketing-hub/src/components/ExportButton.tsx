import { useState, type RefObject } from 'react'
import type { CampaignAsset } from '../data/types'
import { exportAssetAsPng } from '../utils/exportAsset'

interface ExportButtonProps {
  asset: CampaignAsset
  exportRef: RefObject<HTMLElement | null>
  className?: string
}

export function ExportButton({ asset, exportRef, className = '' }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    const root = exportRef.current
    if (!root) return

    setExporting(true)
    try {
      await exportAssetAsPng(root, {
        filename: `${asset.slug}-${asset.width}x${asset.height}`,
        width: asset.width,
        height: asset.height,
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={exporting}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#E37226] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#FE980F] disabled:opacity-60 sm:w-auto sm:px-5 ${className}`}
    >
      {exporting ? (
        'Exporting…'
      ) : (
        <>
          <span className="sm:hidden">Download PNG</span>
          <span className="hidden sm:inline">Download PNG ({asset.width}×{asset.height})</span>
        </>
      )}
    </button>
  )
}
