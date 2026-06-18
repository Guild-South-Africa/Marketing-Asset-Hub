const MOBILE_UA = /Android|iPhone|iPad|iPod|Mobile/i

/** Cap WebGL framebuffer size — mobile GPUs often fail at full poster resolution (e.g. 2160×2700). */
export function capWebGlDimensions(
  width: number,
  height: number,
  maxLongEdge?: number,
): { width: number; height: number; scale: number } {
  const isMobile = typeof navigator !== 'undefined' && MOBILE_UA.test(navigator.userAgent)
  const cap = maxLongEdge ?? (isMobile ? 1024 : 2048)
  const long = Math.max(width, height)
  if (long <= cap) return { width, height, scale: 1 }
  const scale = cap / long
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
    scale,
  }
}

export function isMobileDevice(): boolean {
  return typeof navigator !== 'undefined' && MOBILE_UA.test(navigator.userAgent)
}
