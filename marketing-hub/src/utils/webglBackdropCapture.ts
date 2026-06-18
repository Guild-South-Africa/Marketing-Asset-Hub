import { isMobileDevice } from './webglRenderSize'
import { renderStaticBackdropCanvas } from './staticBackdropCapture'

export const WEBGL_BACKDROP_READY = 'webgl-backdrop-ready'

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

export function triggerWebGlCaptureFrame(): void {
  window.dispatchEvent(new Event('webgl-poster-capture'))
}

/** Wait until the live scene has rendered at least one frame (or timeout). */
export function waitForWebGlCanvas(
  exportRoot: HTMLElement,
  timeoutMs = 10000,
): Promise<HTMLCanvasElement | null> {
  const find = () => exportRoot.querySelector('canvas[data-webgl-scene]') as HTMLCanvasElement | null

  const ready = find()
  if (ready?.dataset.webglReady === 'true') return Promise.resolve(ready)

  return new Promise((resolve) => {
    const done = (canvas: HTMLCanvasElement | null) => {
      clearTimeout(timer)
      window.removeEventListener(WEBGL_BACKDROP_READY, onReady)
      resolve(canvas)
    }

    const onReady = () => {
      const canvas = find()
      if (canvas?.dataset.webglReady === 'true') done(canvas)
    }

    const timer = setTimeout(() => done(find()), timeoutMs)
    window.addEventListener(WEBGL_BACKDROP_READY, onReady)

    if (find()) onReady()
  })
}

async function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load WebGL snapshot'))
    img.src = dataUrl
  })
}

/** Snapshot live WebGL canvas at full poster dimensions. */
async function snapshotWebGlCanvas(
  webglCanvas: HTMLCanvasElement,
  width: number,
  height: number,
): Promise<HTMLCanvasElement | null> {
  if (webglCanvas.width < 2 || webglCanvas.height < 2) return null

  triggerWebGlCaptureFrame()
  await waitFrames(isMobileDevice() ? 4 : 2)

  const output = document.createElement('canvas')
  output.width = width
  output.height = height
  const ctx = output.getContext('2d')
  if (!ctx) return null

  const draw = () => ctx.drawImage(webglCanvas, 0, 0, width, height)

  try {
    draw()
    return output
  } catch {
    // iOS Safari — load via data URL when direct drawImage fails
    try {
      const dataUrl = webglCanvas.toDataURL('image/png')
      if (!dataUrl || dataUrl === 'data:,') return null
      const img = await loadImageFromDataUrl(dataUrl)
      ctx.drawImage(img, 0, 0, width, height)
      return output
    } catch {
      return null
    }
  }
}

export async function captureBackdropLayer(
  exportRoot: HTMLElement,
  width: number,
  height: number,
): Promise<HTMLCanvasElement> {
  const seed = Number(exportRoot.querySelector('[data-backdrop-seed]')?.getAttribute('data-backdrop-seed') ?? 0)
  const webglCanvas = await waitForWebGlCanvas(exportRoot)

  if (webglCanvas) {
    const snap = await snapshotWebGlCanvas(webglCanvas, width, height)
    if (snap) return snap
  }

  return renderStaticBackdropCanvas(width, height, seed)
}
