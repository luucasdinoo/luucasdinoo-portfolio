import { motion } from 'motion/react'
import type { ReactNode } from 'react'

type CardProps = {
  index: number
  tone?: 'default' | 'accent'
  className?: string
  children: ReactNode
}

// Border colour comes only from `tone`, so callers never pass a competing border class.
export function Card({ index, tone = 'default', className = '', children }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
      className={`relative rounded-lg border bg-surface-raised/85 p-6 ${tone === 'accent' ? 'border-accent/45' : 'border-line'} ${className}`}
    >
      {children}
    </motion.div>
  )
}
