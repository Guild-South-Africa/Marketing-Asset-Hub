import { useState, type RefObject } from 'react'
import type { CampaignAsset } from '../data/types'
import { resolveBackdrop } from '../data/templateMeta'
import { exportAssetAsGif, exportAssetAsPng } from '../utils/exportAsset'

interface ExportButtonProps {
  asset: CampaignAsset
  exportRef: RefObject<HTMLElement | null>
  className?: string
}

export function ExportButton({ asset, exportRef, className = '' }: ExportButtonProps) {
  const [exporting, setExporting] = useState<'png' | 'gif' | null>(null)
  const [gifProgress, setGifProgress] = useState<{ frame: number; total: number } | null>(null)
  const hasMotionBackdrop = resolveBackdrop(asset) === 'threejs'

  const baseFilename = `${asset.slug}-${asset.width}x${asset.height}`

  const handlePngExport = async () => {
    const root = exportRef.current
    if (!root) return

    setExporting('png')
    try {
      await exportAssetAsPng(root, {
        filename: baseFilename,
        width: asset.width,
        height: asset.height,
      })
    } finally {
      setExporting(null)
    }
  }

  const handleGifExport = async () => {
    const root = exportRef.current
    if (!root) return

    setExporting('gif')
    setGifProgress(null)
    try {
      await exportAssetAsGif(root, {
        filename: baseFilename,
        width: asset.width,
        height: asset.height,
        fps: 12,
        durationSec: 4,
        maxHeight: 1080,
        onProgress: (frame, total) => setGifProgress({ frame, total }),
      })
    } finally {
      setExporting(null)
      setGifProgress(null)
    }
  }

  const busy = exporting !== null
  const gifLabel =
    exporting === 'gif' && gifProgress
      ? `Recording GIF… ${gifProgress.frame}/${gifProgress.total}`
      : 'Download GIF (4s loop)'

  return (
    <div className={`flex w-full flex-col gap-2 sm:w-auto sm:flex-row ${className}`}>
      <button
        type="button"
        onClick={handlePngExport}
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#E37226] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#FE980F] disabled:opacity-60 sm:w-auto sm:px-5"
      >
        {exporting === 'png' ? (
          'Exporting PNG…'
        ) : (
          <>
            <span className="sm:hidden">Download PNG</span>
            <span className="hidden sm:inline">Download PNG ({asset.width}×{asset.height})</span>
          </>
        )}
      </button>

      {hasMotionBackdrop && (
        <button
          type="button"
          onClick={handleGifExport}
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#E37226] bg-transparent px-4 py-2.5 text-sm font-medium text-[#FE980F] transition hover:bg-[#E37226]/10 disabled:opacity-60 sm:w-auto sm:px-5"
        >
          {gifLabel}
        </button>
      )}
    </div>
  )
}
