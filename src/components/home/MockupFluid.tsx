import { useEffect, useRef } from 'react'

// Port of the live preview embedded in the deck's "home" slide: low-res canvas,
// additive blue splats that wander on their own plus a trail behind the cursor.
const COLORS = ['37,132,211', '125,185,236', '16,88,169', '74,157,224', '175,210,241', '12,61,136']

export function MockupFluid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const divisor = window.innerWidth < 1024 ? 4 : 3
    let W = 0
    let H = 0
    let t = 0
    let mx: number | null = null
    let my: number | null = null
    let lx: number | null = null
    let ly: number | null = null
    let raf = 0

    function resize() {
      W = canvas!.width = Math.max(320, (window.innerWidth / divisor) | 0)
      H = canvas!.height = Math.max(180, (window.innerHeight / divisor) | 0)
      ctx!.fillStyle = '#000'
      ctx!.fillRect(0, 0, W, H)
    }

    function splat(px: number, py: number, r: number, color: string, alpha: number) {
      const g = ctx!.createRadialGradient(px, py, 0, px, py, r)
      g.addColorStop(0, `rgba(${color},${alpha})`)
      g.addColorStop(1, `rgba(${color},0)`)
      ctx!.fillStyle = g
      ctx!.beginPath()
      ctx!.arc(px, py, r, 0, 6.3)
      ctx!.fill()
    }

    function frame() {
      t += 0.006
      ctx!.globalCompositeOperation = 'source-over'
      ctx!.fillStyle = 'rgba(0,0,0,0.045)'
      ctx!.fillRect(0, 0, W, H)
      ctx!.globalCompositeOperation = 'lighter'
      for (let k = 0; k < 4; k++) {
        const a = t * (1 + k * 0.31) + k * 1.7
        const px = W * (0.5 + 0.44 * Math.sin(a * 1.21 + k) * Math.cos(a * 0.53))
        const py = H * (0.5 + 0.42 * Math.sin(a * 1.63 + k * 2.3))
        const color = COLORS[(k + ((t * 0.6) | 0)) % COLORS.length]
        splat(px, py, W * 0.07, color, 0.22)
      }
      if (mx !== null && my !== null) {
        if (lx !== null && ly !== null) {
          const n = 6
          for (let i = 0; i < n; i++) {
            splat(lx + ((mx - lx) * i) / n, ly + ((my - ly) * i) / n, W * 0.05, COLORS[((t * 3) | 0) % COLORS.length], 0.18)
          }
        }
        lx = mx
        ly = my
      }
      raf = requestAnimationFrame(frame)
    }

    function onPointerMove(e: PointerEvent) {
      mx = (e.clientX / window.innerWidth) * W
      my = (e.clientY / window.innerHeight) * H
    }

    function onVisibilityChange() {
      cancelAnimationFrame(raf)
      if (document.visibilityState === 'visible') raf = requestAnimationFrame(frame)
    }

    resize()
    window.addEventListener('resize', resize)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      ctx.globalCompositeOperation = 'lighter'
      splat(W * 0.2, H * 0.3, W * 0.3, COLORS[0], 0.35)
      splat(W * 0.8, H * 0.7, W * 0.3, COLORS[2], 0.35)
    } else {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.addEventListener('visibilitychange', onVisibilityChange)
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className="mockup-fluid absolute inset-0 block h-full w-full" />
}
