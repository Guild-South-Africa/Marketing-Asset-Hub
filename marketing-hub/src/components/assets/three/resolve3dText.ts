/** Deterministic PRNG for stable thumbnail layouts */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

export function resolve3dText(headline: string[]): string {
  const first = headline[0]?.replace(/[^A-Za-z0-9 ]/g, '').trim() ?? 'BUILD'
  const words = first.split(/\s+/).filter(Boolean)
  if (words.length === 0) return 'BUILD'
  if (words.length === 1) return words[0]!.toUpperCase()
  return words.slice(0, 2).join(' ').toUpperCase()
}
