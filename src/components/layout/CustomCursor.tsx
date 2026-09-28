import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const finePointerQuery = '(hover: hover) and (pointer: fine)'
const interactive = 'a, button, [role="button"], label, summary, select'

function useFinePointer(): boolean {
  const [fine, setFine] = useState(() => window.matchMedia(finePointerQuery).matches)

  useEffect(() => {
    const query = window.matchMedia(finePointerQuery)
    const listener = (event: MediaQueryListEvent) => setFine(event.matches)
    query.addEventListener('change', listener)
    return () => query.removeEventListener('change', listener)
  }, [])

  return fine
}

// Neon ring + dot that replaces the pointer on mouse devices. Touch and reduced motion keep the native cursor.
export function CustomCursor() {
  const finePointer = useFinePointer()
  const reducedMotion = usePrefersReducedMotion()
  const enabled = finePointer && !reducedMotion
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 450, damping: 38, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 450, damping: 38, mass: 0.6 })
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const html = document.documentElement
    html.classList.add('custom-cursor')

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setVisible(true)
      setHovering(event.target instanceof Element && event.target.closest(interactive) !== null)
    }
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)
    const onLeave = () => setVisible(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    html.addEventListener('pointerleave', onLeave)
    return () => {
      html.classList.remove('custom-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      html.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div style={{ x: ringX, y: ringY }} className="absolute top-0 left-0">
        <motion.div
          animate={{ scale: pressed ? 0.8 : hovering ? 1.6 : 1, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className={`cursor-ring -mt-5 -ml-5 h-10 w-10 rounded-full ${hovering ? 'is-hovering' : ''}`}
        />
      </motion.div>
      <motion.div style={{ x, y }} className="absolute top-0 left-0">
        <motion.div
          animate={{ scale: hovering ? 0 : 1, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="cursor-dot -mt-1 -ml-1 h-2 w-2 rounded-full bg-accent"
        />
      </motion.div>
    </div>
  )
}
