import html2canvas from 'html2canvas'
import { GIFEncoder, applyPalette, quantize } from 'gifenc'
import { fixCoverImages } from './imageCover'

export interface ExportOptions {
  filename: string
  width: number
  height: number
}

export interface GifExportOptions extends ExportOptions {
  fps?: number
  durationSec?: number
  /** Cap GIF height to keep file size reasonable (default 1080) */
  maxHeight?: number
  onProgress?: (frame: number, total: number) => void
}

async function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll('img'))
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve()
            return
          }
          img.addEventListener('load', () => resolve(), { once: true })
          img.addEventListener('error', () => resolve(), { once: true })
        }),
    ),
  )
}

/** Clone the preview node and render at full native size — avoids CSS transform scaling artifacts. */
function createExportClone(element: HTMLElement, width: number, height: number): HTMLElement {
  const clone = element.cloneNode(true) as HTMLElement

  clone.style.transform = 'none'
  clone.style.transformOrigin = 'top left'
  clone.style.position = 'fixed'
  clone.style.left = '-100000px'
  clone.style.top = '0'
  clone.style.width = `${width}px`
  clone.style.height = `${height}px`
  clone.style.overflow = 'hidden'
  clone.style.margin = '0'
  clone.style.padding = '0'
  clone.style.boxSizing = 'border-box'
  clone.style.pointerEvents = 'none'
  clone.style.zIndex = '-1'

  document.body.appendChild(clone)
  return clone
}

export async function exportAssetAsPng(
  element: HTMLElement,
  { filename, width, height }: ExportOptions,
): Promise<void> {
  if (element.querySelector('[data-webgl-poster]')) {
    await exportWebGlPoster(element, { filename, width, height })
    return
  }

  fixCoverImages(element)
  const clone = createExportClone(element, width, height)

  try {
    await document.fonts.ready
    await waitForImages(clone)
    fixCoverImages(clone)
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    })

    const canvas = await html2canvas(clone, {
      scale: 1,
      width,
      height,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      imageTimeout: 15000,
      scrollX: 0,
      scrollY: 0,
      windowWidth: width,
      windowHeight: height,
    })

    if (canvas.width !== width || canvas.height !== height) {
      const output = document.createElement('canvas')
      output.width = width
      output.height = height
      const ctx = output.getContext('2d')
      if (!ctx) throw new Error('Could not create export canvas')
      ctx.drawImage(canvas, 0, 0, width, height)
      downloadCanvas(output, filename)
      return
    }

    downloadCanvas(canvas, filename)
  } finally {
    clone.remove()
  }
}

function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a')
  link.download = `${filename}.png`
  link.href = canvas.toDataURL('image/png', 1.0)
  link.click()
}

function downloadBlob(blob: Blob, filename: string): void {
  const link = document.createElement('a')
  link.download = filename
  link.href = URL.createObjectURL(blob)
  link.click()
  URL.revokeObjectURL(link.href)
}

/** Ask the live WebGL scene to render one frame before capture */
function captureWebGlPosterFrame(): void {
  window.dispatchEvent(new Event('webgl-poster-capture'))
}

function waitFrames(count = 2): Promise<void> {
  return new Promise((resolve) => {
    let remaining = count
    const step = () => {
      remaining -= 1
      if (remaining <= 0) resolve()
      else requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  })
}

/** Clone export root at native size and capture DOM layer (ignores WebGL canvas) */
async function renderDomLayerCanvas(
  exportRoot: HTMLElement,
  width: number,
  height: number,
): Promise<HTMLCanvasElement> {
  const clone = createExportClone(exportRoot, width, height)

  try {
    await document.fonts.ready
    await waitForImages(clone)
    fixCoverImages(clone)
    await waitFrames(2)

    return html2canvas(clone, {
      scale: 1,
      width,
      height,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      imageTimeout: 15000,
      scrollX: 0,
      scrollY: 0,
      windowWidth: width,
      windowHeight: height,
      ignoreElements: (el) => el.matches('canvas[data-webgl-scene]'),
    })
  } finally {
    clone.remove()
  }
}

function compositeWebGlFrame(
  webglCanvas: HTMLCanvasElement,
  domCanvas: HTMLCanvasElement | null,
  width: number,
  height: number,
): HTMLCanvasElement {
  const output = document.createElement('canvas')
  output.width = width
  output.height = height
  const ctx = output.getContext('2d')
  if (!ctx) throw new Error('Could not create composite canvas')

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(webglCanvas, 0, 0, width, height)
  if (domCanvas) {
    ctx.drawImage(domCanvas, 0, 0, width, height)
  }
  return output
}

/** Animated GIF — WebGL poster only; composites motion + GUILD overlay */
export async function exportAssetAsGif(
  element: HTMLElement,
  {
    filename,
    width,
    height,
    fps = 12,
    durationSec = 4,
    maxHeight = 1080,
    onProgress,
  }: GifExportOptions,
): Promise<void> {
  if (!element.querySelector('[data-webgl-poster]')) {
    throw new Error('GIF export is only available for designs with a Three.js motion backdrop')
  }

  const exportRoot = (element.closest('[data-export-root]') as HTMLElement | null) ?? element
  const webglCanvas = exportRoot.querySelector('canvas[data-webgl-scene]') as HTMLCanvasElement | null
  if (!webglCanvas) throw new Error('WebGL canvas not found')

  await document.fonts.ready

  const scale = height > maxHeight ? maxHeight / height : 1
  const gifW = Math.round(width * scale)
  const gifH = Math.round(height * scale)

  const domCanvas = await renderDomLayerCanvas(exportRoot, width, height)

  const scratch = document.createElement('canvas')
  scratch.width = gifW
  scratch.height = gifH
  const scratchCtx = scratch.getContext('2d', { willReadFrequently: true })
  if (!scratchCtx) throw new Error('Could not create scratch canvas')

  const frameCount = Math.round(fps * durationSec)
  const frameDelay = Math.round(1000 / fps)
  const encoder = GIFEncoder()

  for (let i = 0; i < frameCount; i++) {
    captureWebGlPosterFrame()
    await waitFrames(2)

    const frame = compositeWebGlFrame(webglCanvas, domCanvas, width, height)
    scratchCtx.drawImage(frame, 0, 0, gifW, gifH)
    const { data } = scratchCtx.getImageData(0, 0, gifW, gifH)

    const palette = quantize(data, 256)
    const index = applyPalette(data, palette)
    encoder.writeFrame(index, gifW, gifH, { palette, delay: frameDelay })

    onProgress?.(i + 1, frameCount)
  }

  encoder.finish()
  downloadBlob(new Blob([Uint8Array.from(encoder.bytes())], { type: 'image/gif' }), `${filename}.gif`)
}

/** Composite live WebGL canvas + DOM overlay — html2canvas cannot capture WebGL */
async function exportWebGlPoster(
  element: HTMLElement,
  { filename, width, height }: ExportOptions,
): Promise<void> {
  const exportRoot = (element.closest('[data-export-root]') as HTMLElement | null) ?? element
  const webglCanvas = exportRoot.querySelector('canvas[data-webgl-scene]') as HTMLCanvasElement | null

  if (!webglCanvas) throw new Error('WebGL canvas not found')

  captureWebGlPosterFrame()
  await document.fonts.ready
  await waitFrames(2)

  const domCanvas = await renderDomLayerCanvas(exportRoot, width, height)
  const output = compositeWebGlFrame(webglCanvas, domCanvas, width, height)
  downloadCanvas(output, filename)
}
