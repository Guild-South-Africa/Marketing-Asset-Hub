import html2canvas from 'html2canvas'
import { brand } from '../data/brand'
import { guildWireframeColors } from '../components/assets/three/guildMatcap'
import { seededRandom } from '../components/assets/three/resolve3dText'

/** Build the CSS wireframe stand-in off-screen and rasterize for export fallback */
export async function renderStaticBackdropCanvas(
  width: number,
  height: number,
  seed = 0,
): Promise<HTMLCanvasElement> {
  const rand = seededRandom(seed)
  const root = document.createElement('div')
  root.style.cssText = `position:fixed;left:-100000px;top:0;width:${width}px;height:${height}px;background:#000;overflow:hidden;`

  const wash = document.createElement('div')
  wash.style.cssText = `position:absolute;inset:-20%;background:radial-gradient(circle at 35% 30%, ${brand.colors.burntOrange}55 0%, transparent 45%), radial-gradient(circle at 70% 65%, ${brand.colors.mutedYellow}33 0%, transparent 40%);`
  root.appendChild(wash)

  for (let i = 0; i < 8; i++) {
    const shape = document.createElement('div')
    const size = rand() * 0.18 + 0.1
    shape.style.cssText = [
      'position:absolute',
      `left:${rand() * 85 + 5}%`,
      `top:${rand() * 80 + 5}%`,
      `width:${size * 100}%`,
      `height:${size * 100}%`,
      `transform:rotate(${rand() * 360}deg)`,
      `border:1px solid ${guildWireframeColors[i % guildWireframeColors.length]}`,
      `opacity:${rand() * 0.25 + 0.2}`,
      `border-radius:${i % 3 === 0 ? '50%' : '0'}`,
    ].join(';')
    root.appendChild(shape)
  }

  document.body.appendChild(root)
  try {
    return await html2canvas(root, {
      scale: 1,
      width,
      height,
      backgroundColor: '#000000',
      logging: false,
      useCORS: true,
    })
  } finally {
    root.remove()
  }
}
