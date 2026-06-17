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

  if (backdrop === 'flat') {
    return <PosterBackdrop s={s} dark={dark} />
  }

  if (renderMode === 'thumbnail') {
    return <StaticPosterBackground seed={seed} />
  }

  return (
    <Suspense fallback={<StaticPosterBackground seed={seed} />}>
      <ThreeJsBackdropScene width={width} height={height} seed={seed} />
    </Suspense>
  )
}
