import { lazy, Suspense } from 'react'
import { useRenderMode } from '../../context/RenderModeContext'
import { PosterBackdrop } from './BrandDecor'
import { StaticPosterBackground } from './three/StaticPosterBackground'

const ThreeJsBackdropScene = lazy(() =>
  import('./three/ThreeJsBackdropScene').then((m) => ({ default: m.ThreeJsBackdropScene })),
)

export type BackdropVariant = 'flat' | 'threejs'

interface BackdropLayerProps {
  backdrop: BackdropVariant
  width: number
  height: number
  dark: boolean
  s: number
  seed: number
}

export function BackdropLayer({ backdrop, width, height, dark, s, seed }: BackdropLayerProps) {
  const renderMode = useRenderMode()

  let layer: React.ReactNode
  if (backdrop === 'flat') {
    layer = <PosterBackdrop s={s} dark={dark} />
  } else if (renderMode === 'thumbnail') {
    layer = <StaticPosterBackground seed={seed} />
  } else {
    layer = (
      <Suspense fallback={<StaticPosterBackground seed={seed} />}>
        <ThreeJsBackdropScene width={width} height={height} seed={seed} />
      </Suspense>
    )
  }

  return (
    <div data-backdrop-layer aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      {layer}
    </div>
  )
}
