import { motion } from 'motion/react'
import { fadeRise } from './fadeRise'

type AvatarOrbProps = {
  src?: string
  alt?: string
}

export function AvatarOrb({ src, alt = '' }: AvatarOrbProps) {
  return (
    <motion.div
      {...fadeRise(0.15)}
      className="h-[220px] w-[220px] shrink-0 overflow-hidden rounded-full lg:h-360 lg:w-360"
      style={{
        background: 'radial-gradient(circle at 50% 30%, var(--blue-400) 0%, var(--blue-700) 55%, var(--blue-900) 100%)',
        boxShadow:
          '0 0 0 1px var(--accent), 0 0 max(48px, calc(var(--u) * 80)) color-mix(in srgb, var(--accent) 45%, transparent)',
      }}
    >
      {src && <img src={src} alt={alt} width={720} height={720} className="h-full w-full object-cover" />}
    </motion.div>
  )
}
