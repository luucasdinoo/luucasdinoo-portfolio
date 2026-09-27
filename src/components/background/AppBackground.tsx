import { MockupFluid } from './MockupFluid'

const veil =
  'radial-gradient(ellipse at 50% 48%, color-mix(in srgb, var(--surface) 78%, transparent) 0%, color-mix(in srgb, var(--surface) 35%, transparent) 45%, transparent 70%)'

/** The home mockup's fluid + contrast veil, pinned behind every page. */
export function AppBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <MockupFluid />
      <div className="absolute inset-0" style={{ background: veil }} />
    </div>
  )
}
