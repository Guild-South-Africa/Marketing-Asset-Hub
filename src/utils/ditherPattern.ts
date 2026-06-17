/** Recursively build a Bayer ordered-dither matrix (values 0 … n²−1). */
function bayerMatrix(size: number): number[][] {
  if (size === 1) return [[0]]
  const half = size / 2
  const sub = bayerMatrix(half)
  const quadrantOffsets = [
    [0, 2],
    [3, 1],
  ]
  const matrix: number[][] = Array.from({ length: size }, () => Array(size).fill(0))

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const qy = Math.floor(y / half)
      const qx = Math.floor(x / half)
      matrix[y]![x] = 4 * sub[y % half]![x % half]! + quadrantOffsets[qy]![qx]!
    }
  }

  return matrix
}

function svgDataUrl(svg: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

function bayerSvg(size: number): string {
  const matrix = bayerMatrix(size)
  const max = size * size
  const rects = matrix
    .flatMap((row, y) =>
      row.map((v, x) => {
        const opacity = (v + 0.5) / max
        return `<rect x="${x}" y="${y}" width="1" height="1" fill="#000" fill-opacity="${opacity.toFixed(4)}"/>`
      }),
    )
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" shape-rendering="crispEdges">${rects}</svg>`
}

/** Fine 2×2 halftone — punchy dots on flat chromatic fills */
function halftoneSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2" shape-rendering="crispEdges">
    <rect x="0" y="0" width="1" height="1" fill="#000" fill-opacity="0"/>
    <rect x="1" y="0" width="1" height="1" fill="#000" fill-opacity="0.5"/>
    <rect x="0" y="1" width="1" height="1" fill="#000" fill-opacity="0.75"/>
    <rect x="1" y="1" width="1" height="1" fill="#000" fill-opacity="0.25"/>
  </svg>`
}

export const ditherPatterns = {
  bayer4: svgDataUrl(bayerSvg(4)),
  bayer8: svgDataUrl(bayerSvg(8)),
  halftone: svgDataUrl(halftoneSvg()),
} as const

export function ditherTileSize(s: number, base = 4): number {
  return base * Math.max(1, Math.round(s))
}
