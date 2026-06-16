import { useEffect, useState, type RefObject } from 'react'

/** Tracks container width, capped at maxWidth — for fluid asset previews on mobile through desktop. */
export function useContainerWidth(
  ref: RefObject<HTMLElement | null>,
  maxWidth: number,
  fallback = maxWidth,
) {
  const [width, setWidth] = useState(fallback)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const available = el.clientWidth
      setWidth(available > 0 ? Math.min(maxWidth, available) : maxWidth)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [maxWidth])

  return width
}
