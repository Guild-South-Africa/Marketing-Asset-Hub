import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { WEBGL_BACKDROP_READY } from '../../../utils/webglBackdropCapture'
import { capWebGlDimensions } from '../../../utils/webglRenderSize'
import { guildWireframeColors } from './guildMatcap'
import { seededRandom } from './resolve3dText'

interface ThreeJsBackdropSceneProps {
  width: number
  height: number
  seed?: number
}

function figureCountForAspect(width: number, height: number): number {
  const ratio = width / height
  if (ratio > 1.4) return 24
  if (ratio < 0.75) return 40
  return 32
}

function sceneSpread(width: number, height: number): { x: number; y: number; z: number } {
  const ratio = width / height
  return {
    x: ratio > 1.2 ? 11 : 9,
    y: ratio < 0.85 ? 9 : 7,
    z: 6,
  }
}

/** Animated wireframe backdrop — no 3D text; sits behind template content */
export function ThreeJsBackdropScene({ width, height, seed = 0 }: ThreeJsBackdropSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let disposed = false
    const { width: renderW, height: renderH } = capWebGlDimensions(width, height)

    const rand = seededRandom(seed)
    const aspect = width / height
    const spread = sceneSpread(width, height)
    const figureCount = figureCountForAspect(width, height)

    let renderer: THREE.WebGLRenderer | null = null
    let frameId = 0

    try {
      const scene = new THREE.Scene()
      scene.background = new THREE.Color('#000000')

      const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100)
      camera.position.set(0, aspect < 0.85 ? 0.5 : 0.2, aspect > 1.2 ? 12 : 11)

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: renderW >= 512,
        alpha: false,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
      })
      renderer.setSize(renderW, renderH, false)
      renderer.setPixelRatio(1)
      renderer.outputColorSpace = THREE.SRGBColorSpace

      canvas.dataset.webglReady = 'false'
      canvas.dataset.renderWidth = String(renderW)
      canvas.dataset.renderHeight = String(renderH)

      const figures: THREE.Mesh[] = []
      const geometries = [
        new THREE.TorusGeometry(0.5, 0.22, 12, 32),
        new THREE.SphereGeometry(0.55, 24, 24),
        new THREE.BoxGeometry(0.85, 0.85, 0.85, 2, 2, 2),
        new THREE.ConeGeometry(0.5, 1.1, 20),
        new THREE.OctahedronGeometry(0.55, 0),
      ]

      for (let i = 0; i < figureCount; i++) {
        const geometry = geometries[i % geometries.length]!.clone()
        const color = guildWireframeColors[i % guildWireframeColors.length]!
        const material = new THREE.MeshBasicMaterial({
          color,
          wireframe: true,
          transparent: true,
          opacity: 0.55,
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(
          (rand() - 0.5) * spread.x,
          (rand() - 0.5) * spread.y,
          (rand() - 0.5) * spread.z - 1,
        )
        mesh.rotation.set(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI)
        mesh.scale.setScalar(rand() * 0.55 + 0.35)
        scene.add(mesh)
        figures.push(mesh)
      }

      scene.add(new THREE.AmbientLight(0xffffff, 1.2))
      const pointLight = new THREE.PointLight(0xffffff, 280)
      pointLight.position.set(2, 3, 5)
      scene.add(pointLight)

      const clock = new THREE.Clock()
      let visible = !document.hidden
      let hasRendered = false

      const render = () => {
        const elapsed = clock.getElapsedTime()
        figures.forEach((figure, index) => {
          figure.rotation.y += 0.004
          figure.rotation.x += 0.002
          figure.position.y += Math.sin(elapsed * 0.8 + index * 0.35) * 0.0025
        })
        camera.position.x = Math.sin(elapsed * 0.15) * 0.4
        camera.lookAt(0, 0, 0)
        renderer!.render(scene, camera)

        if (!hasRendered) {
          hasRendered = true
          canvas.dataset.webglReady = 'true'
          window.dispatchEvent(new Event(WEBGL_BACKDROP_READY))
        }
      }

      const tick = () => {
        if (disposed) return
        if (visible) render()
        frameId = requestAnimationFrame(tick)
      }
      tick()

      const onCapture = () => render()
      const onVisibility = () => {
        visible = !document.hidden
      }
      window.addEventListener('webgl-poster-capture', onCapture)
      document.addEventListener('visibilitychange', onVisibility)

      return () => {
        disposed = true
        window.removeEventListener('webgl-poster-capture', onCapture)
        document.removeEventListener('visibilitychange', onVisibility)
        cancelAnimationFrame(frameId)
        renderer?.dispose()
        figures.forEach((mesh) => {
          mesh.geometry.dispose()
          ;(mesh.material as THREE.Material).dispose()
        })
        geometries.forEach((g) => g.dispose())
        delete canvas.dataset.webglReady
      }
    } catch {
      delete canvas.dataset.webglReady
      window.dispatchEvent(new Event(WEBGL_BACKDROP_READY))
      return () => {
        disposed = true
        cancelAnimationFrame(frameId)
        renderer?.dispose()
      }
    }
  }, [width, height, seed])

  return (
    <canvas
      ref={canvasRef}
      data-webgl-scene
      className="webgl"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        outline: 'none',
        zIndex: 0,
      }}
    />
  )
}
