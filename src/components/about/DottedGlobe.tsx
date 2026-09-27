import { useEffect, useRef } from 'react'

type Props = {
  lat: number
  lon: number
  className?: string
}

type RGB = [number, number, number]

function cssColor(name: string): RGB {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim().replace('#', '')
  const value = Number.parseInt(hex, 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

const POINTS = 1500
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

// Evenly spread dots on a unit sphere (Fibonacci lattice).
const sphere: [number, number, number][] = Array.from({ length: POINTS }, (_, i) => {
  const y = 1 - (i / (POINTS - 1)) * 2
  const r = Math.sqrt(1 - y * y)
  const theta = GOLDEN_ANGLE * i
  return [Math.cos(theta) * r, y, Math.sin(theta) * r]
})

export function DottedGlobe({ lat, lon, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const la = (lat * Math.PI) / 180
    const lo = (lon * Math.PI) / 180
    const marker: [number, number, number] = [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)]
    // Tilt so the marker sits in the upper, visible part of the (bottom-cropped) globe.
    const tilt = la - 0.4
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let dot = cssColor('--ink-muted')
    let accent = cssColor('--accent')
    let t = 0
    let last = performance.now()
    let raf = 0
    let onScreen = true

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = Math.round(canvas!.clientWidth * dpr)
      canvas!.height = Math.round(canvas!.clientHeight * dpr)
    }

    function project([x, y, z]: [number, number, number], yaw: number) {
      const x1 = x * Math.cos(yaw) + z * Math.sin(yaw)
      const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw)
      const y2 = y * Math.cos(tilt) - z1 * Math.sin(tilt)
      const z2 = y * Math.sin(tilt) + z1 * Math.cos(tilt)
      return [x1, y2, z2] as const
    }

    function draw() {
      const W = canvas!.width
      const H = canvas!.height
      const R = Math.min(W, H) * 0.48
      const cx = W / 2
      const cy = H / 2
      const unit = W / 400
      const yaw = -lo + Math.sin(t * 0.2) * 0.55

      ctx!.clearRect(0, 0, W, H)
      ctx!.beginPath()
      ctx!.arc(cx, cy, R, 0, Math.PI * 2)
      ctx!.strokeStyle = `rgba(${accent.join(',')},0.18)`
      ctx!.lineWidth = unit
      ctx!.stroke()

      for (const point of sphere) {
        const [x, y, z] = project(point, yaw)
        if (z <= 0) continue
        const size = (1 + 1.2 * z) * unit
        ctx!.fillStyle = `rgba(${dot.join(',')},${0.2 + 0.65 * z})`
        ctx!.fillRect(cx + x * R - size / 2, cy - y * R - size / 2, size, size)
      }

      const [mx, my, mz] = project(marker, yaw)
      if (mz > 0) {
        const px = cx + mx * R
        const py = cy - my * R
        const glow = ctx!.createRadialGradient(px, py, 0, px, py, 16 * unit)
        glow.addColorStop(0, `rgba(${accent.join(',')},0.55)`)
        glow.addColorStop(1, `rgba(${accent.join(',')},0)`)
        ctx!.fillStyle = glow
        ctx!.beginPath()
        ctx!.arc(px, py, 16 * unit, 0, Math.PI * 2)
        ctx!.fill()
        if (!reduced) {
          const phase = (t * 0.6) % 1
          ctx!.beginPath()
          ctx!.arc(px, py, (4 + phase * 14) * unit, 0, Math.PI * 2)
          ctx!.strokeStyle = `rgba(${accent.join(',')},${0.6 * (1 - phase)})`
          ctx!.lineWidth = 1.2 * unit
          ctx!.stroke()
        }
        ctx!.beginPath()
        ctx!.arc(px, py, 3.2 * unit, 0, Math.PI * 2)
        ctx!.fillStyle = `rgb(${accent.join(',')})`
        ctx!.fill()
      }
    }

    function frame(now: number) {
      t += Math.min((now - last) / 1000, 0.1)
      last = now
      draw()
      raf = requestAnimationFrame(frame)
    }

    function start() {
      cancelAnimationFrame(raf)
      if (reduced || !onScreen || document.visibilityState !== 'visible') return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    resize()
    draw()
    start()

    const resizeObserver = new ResizeObserver(() => {
      resize()
      draw()
    })
    resizeObserver.observe(canvas)

    const intersection = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      start()
    })
    intersection.observe(canvas)

    const themeObserver = new MutationObserver(() => {
      dot = cssColor('--ink-muted')
      accent = cssColor('--accent')
      draw()
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    document.addEventListener('visibilitychange', start)

    return () => {
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersection.disconnect()
      themeObserver.disconnect()
      document.removeEventListener('visibilitychange', start)
    }
  }, [lat, lon])

  return <canvas ref={canvasRef} aria-hidden className={className} />
}
