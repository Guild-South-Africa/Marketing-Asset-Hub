import type { CampaignAsset } from '../../data/types'
import { TemplateDesign } from './TemplateDesign'

interface AssetRendererProps {
  asset: CampaignAsset
}

/** Renders the full coded poster design — not template PNGs */
export function AssetRenderer({ asset }: AssetRendererProps) {
  return <TemplateDesign asset={asset} />
}
