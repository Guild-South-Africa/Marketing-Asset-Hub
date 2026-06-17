import * as THREE from 'three'
import { brand } from '../../../data/brand'

/** Warm GUILD SA matcap — burnt orange core, muted yellow highlight */
export function createGuildMatcapTexture(): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(
    size * 0.35,
    size * 0.32,
    size * 0.08,
    size * 0.5,
    size * 0.5,
    size * 0.52,
  )
  gradient.addColorStop(0, brand.colors.solidYellow)
  gradient.addColorStop(0.45, brand.colors.brightOrange)
  gradient.addColorStop(1, brand.colors.burntOrange)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export const guildWireframeColors = [
  brand.colors.burntOrange,
  brand.colors.brightOrange,
  brand.colors.mutedYellow,
] as const
