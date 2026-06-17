import { brand } from '../../../data/brand'
import { guildWireframeColors } from './guildMatcap'
import { seededRandom } from './resolve3dText'

interface StaticPosterBackgroundProps {
  seed?: number
}

/** Lightweight CSS stand-in for gallery thumbnails — avoids WebGL context limits */
export function StaticPosterBackground({ seed = 0 }: StaticPosterBackgroundProps) {
  const rand = seededRandom(seed)
  const shapes = Array.from({ length: 8 }, (_, i) => ({
    left: `${rand() * 85 + 5}%`,
    top: `${rand() * 80 + 5}%`,
    size: `${rand() * 18 + 10}%`,
    rotate: `${rand() * 360}deg`,
    color: guildWireframeColors[i % guildWireframeColors.length]!,
    opacity: rand() * 0.25 + 0.2,
  }))

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: '#000',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          background: `radial-gradient(circle at 35% 30%, ${brand.colors.burntOrange}55 0%, transparent 45%),
            radial-gradient(circle at 70% 65%, ${brand.colors.mutedYellow}33 0%, transparent 40%)`,
        }}
      />
      {shapes.map((shape, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: shape.left,
            top: shape.top,
            width: shape.size,
            height: shape.size,
            transform: `rotate(${shape.rotate})`,
            border: `1px solid ${shape.color}`,
            opacity: shape.opacity,
            borderRadius: i % 3 === 0 ? '50%' : 0,
          }}
        />
      ))}
    </div>
  )
}
