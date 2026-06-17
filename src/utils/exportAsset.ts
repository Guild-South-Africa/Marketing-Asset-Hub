import html2canvas from 'html2canvas'
import { fixCoverImages } from './imageCover'

export interface ExportOptions {
  filename: string
  width: number
  height: number
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
