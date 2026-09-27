export function fadeRise(delay: number) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2, delay, ease: 'easeOut' as const },
  }
}
