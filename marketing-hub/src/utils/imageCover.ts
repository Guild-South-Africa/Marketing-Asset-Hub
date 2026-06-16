/** Pixel dimensions to fill a container with object-fit: cover behavior (no distortion). */
export function coverImageSize(
  containerWidth: number,
  containerHeight: number,
  imageWidth: number,
  imageHeight: number,
): { width: number; height: number } {
  if (containerWidth <= 0 || containerHeight <= 0 || imageWidth <= 0 || imageHeight <= 0) {
    return { width: containerWidth, height: containerHeight }
  }

  const scale = Math.max(containerWidth / imageWidth, containerHeight / imageHeight)
  return {
    width: Math.ceil(imageWidth * scale),
    height: Math.ceil(imageHeight * scale),
  }
}

/** Apply cover-fit inline styles — html2canvas ignores object-fit: cover. */
export function applyCoverFit(img: HTMLImageElement, container: HTMLElement): void {
  const { naturalWidth, naturalHeight } = img
  if (!naturalWidth || !naturalHeight) return

  const { width, height } = coverImageSize(
    container.clientWidth,
    container.clientHeight,
    naturalWidth,
    naturalHeight,
  )

  img.style.position = 'absolute'
  img.style.left = '50%'
  img.style.top = '50%'
  img.style.transform = 'translate(-50%, -50%)'
  img.style.width = `${width}px`
  img.style.height = `${height}px`
  img.style.maxWidth = 'none'
  img.style.maxHeight = 'none'
  img.style.objectFit = 'unset'
  img.style.display = 'block'
}

export function fixCoverImages(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-photo-module]').forEach((container) => {
    const img = container.querySelector('img')
    if (img) applyCoverFit(img, container)
  })
}
