import guildLogo from '@brand/Master Logo.png'
import guildMasterSymbol from '@brand/Master_Symbol_qenm2q.png'
import guildBlack from '@brand/GUILD Black.png'
import guildWhite from '@brand/Guild sa white.png'

import lovableLogoBlack from '@event/Sponsorships/Lovable/lovable-logo-black.png'
import lovableLogoWhite from '@event/Sponsorships/Lovable/lovable-logo-white.png'
import velozTechLogo from '@event/Partners/VelozTech/Veloztech logo.png'
import velozTechWhite from '@event/Partners/VelozTech/velozwhite.png'
import eduvosBlue from '@event/Partners/Eduvos/Eduvos blue.png'
import eduvosWhite from '@event/Partners/Eduvos/Eduvos white.png'

/** Load stock photos from Stocks/ — glob keeps dev/build in sync when files are replaced */
const stockModules = import.meta.glob<string>(
  ['../../assets/Stocks/brand stock*.png', '../../../Stocks/brand stock*.png'],
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
)

function stockNumber(path: string): number {
  return Number(path.match(/brand stock(\d+)\.png/i)?.[1] ?? 0)
}

export const stockPhotos = Object.entries(stockModules)
  .sort(([a], [b]) => stockNumber(a) - stockNumber(b))
  .map(([, url]) => url)

export const brandAssets = {
  guildLogo,
  guildMasterSymbol,
  guildBlack,
  guildWhite,
  lovableLogoBlack,
  lovableLogoWhite,
  velozTechLogo,
  velozTechWhite,
  eduvosBlue,
  eduvosWhite,
} as const

export function getStockPhoto(index: number): string {
  if (stockPhotos.length === 0) return ''
  return stockPhotos[index % stockPhotos.length] ?? stockPhotos[0]!
}

export function getLovableLogo(dark: boolean): string {
  return dark ? brandAssets.lovableLogoWhite : brandAssets.lovableLogoBlack
}

export function getVelozTechLogo(dark: boolean): string {
  return dark ? brandAssets.velozTechWhite : brandAssets.velozTechLogo
}

export function getEduvosLogo(dark: boolean): string {
  return dark ? brandAssets.eduvosWhite : brandAssets.eduvosBlue
}

export function getGuildHeaderLogo(dark: boolean): string {
  return dark ? brandAssets.guildWhite : brandAssets.guildLogo
}
