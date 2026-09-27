import { useEffect, useRef } from 'react'
import type { GeoPermissibleObjects } from 'd3-geo'
import type { GeometryCollection, Topology } from 'topojson-specification'

type Props = {
  lat: number
  lon: number
  /** ISO 3166-1 numeric id of the country to highlight (Brazil = "076"). */
  highlight?: string
  className?: string
}

function cssRgb(name: string) {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim().replace('#', '')
  const value = Number.parseInt(hex, 16)
  return `${(value >> 16) & 255},${(value >> 8) & 255},${value & 255}`
}

// Map data and d3-geo (~50 KB gzip) are split out and fetched only when the card nears the viewport.
function loadMapModules() {
  return Promise.all([import('d3-geo'), import('topojson-client'), import('world-atlas/countries-110m.json')])
}

type MapModules = Awaited<ReturnType<typeof loadMapModules>>

/** Orthographic globe with real country shapes (Natural Earth 1:110m), marker pulsing on `lat`/`lon`. */
export function WorldGlobe({ lat, lon, highlight = '076', className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let disposed = false
    let cleanup = () => {}
    let retryTimer: ReturnType<typeof setTimeout> | undefined

    function init([geo, topojson, atlasModule]: MapModules) {
      const atlas = atlasModule.default as unknown as Topology<{ countries: GeometryCollection }>
      const countries = topojson.feature(atlas, atlas.objects.countries)
      const home = countries.features.find((f) => f.id === highlight)
      const borders = topojson.mesh(atlas, atlas.objects.countries, (a, b) => a !== b)
      const graticule = geo.geoGraticule10()
      const sphere: GeoPermissibleObjects = { type: 'Sphere' }

      const projection = geo.geoOrthographic().clipAngle(90).precision(0.4)
      const path = geo.geoPath(projection, ctx)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      let ink = cssRgb('--ink-muted')
      let accent = cssRgb('--accent')
      let t = 0
      let last = performance.now()
      let raf = 0
      let onScreen = true

      function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        canvas!.width = Math.round(canvas!.clientWidth * dpr)
        canvas!.height = Math.round(canvas!.clientHeight * dpr)
      }

      function draw() {
        const W = canvas!.width
        const H = canvas!.height
        const unit = W / 400
        const R = Math.min(W, H) * 0.48
        // Centre ~22° south of the marker so it sits in the visible upper half of the cropped globe.
        const yaw = -lon + Math.sin(t * 0.2) * 25
        projection.translate([W / 2, H / 2]).scale(R).rotate([yaw, 22 - lat])

        ctx!.clearRect(0, 0, W, H)

        ctx!.beginPath()
        path(sphere)
        ctx!.fillStyle = `rgba(${accent},0.05)`
        ctx!.fill()

        ctx!.beginPath()
        path(graticule)
        ctx!.strokeStyle = `rgba(${ink},0.1)`
        ctx!.lineWidth = 0.6 * unit
        ctx!.stroke()

        ctx!.beginPath()
        path(countries)
        ctx!.fillStyle = `rgba(${ink},0.24)`
        ctx!.fill()

        if (home) {
          ctx!.beginPath()
          path(home)
          ctx!.fillStyle = `rgba(${accent},0.45)`
          ctx!.fill()
        }

        ctx!.beginPath()
        path(borders)
        ctx!.strokeStyle = `rgba(${ink},0.45)`
        ctx!.lineWidth = 0.5 * unit
        ctx!.stroke()

        if (home) {
          ctx!.beginPath()
          path(home)
          ctx!.strokeStyle = `rgba(${accent},0.9)`
          ctx!.lineWidth = 0.9 * unit
          ctx!.stroke()
        }

        ctx!.beginPath()
        path(sphere)
        ctx!.strokeStyle = `rgba(${accent},0.3)`
        ctx!.lineWidth = unit
        ctx!.stroke()

        const centre: [number, number] = [-yaw, lat - 22]
        const point = projection([lon, lat])
        if (point && geo.geoDistance(centre, [lon, lat]) < Math.PI / 2) {
          const [px, py] = point
          const glow = ctx!.createRadialGradient(px, py, 0, px, py, 16 * unit)
          glow.addColorStop(0, `rgba(${accent},0.6)`)
          glow.addColorStop(1, `rgba(${accent},0)`)
          ctx!.fillStyle = glow
          ctx!.beginPath()
          ctx!.arc(px, py, 16 * unit, 0, Math.PI * 2)
          ctx!.fill()
          if (!reduced) {
            const phase = (t * 0.6) % 1
            ctx!.beginPath()
            ctx!.arc(px, py, (4 + phase * 14) * unit, 0, Math.PI * 2)
            ctx!.strokeStyle = `rgba(${accent},${0.7 * (1 - phase)})`
            ctx!.lineWidth = 1.2 * unit
            ctx!.stroke()
          }
          ctx!.beginPath()
          ctx!.arc(px, py, 3.2 * unit, 0, Math.PI * 2)
          ctx!.fillStyle = `rgb(${accent})`
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
      resizeObserver.observe(canvas!)

      const intersection = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting
        start()
      })
      intersection.observe(canvas!)

      const themeObserver = new MutationObserver(() => {
        ink = cssRgb('--ink-muted')
        accent = cssRgb('--accent')
        draw()
      })
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

      document.addEventListener('visibilitychange', start)

      cleanup = () => {
        cancelAnimationFrame(raf)
        resizeObserver.disconnect()
        intersection.disconnect()
        themeObserver.disconnect()
        document.removeEventListener('visibilitychange', start)
      }
    }

    function load(attempt = 0) {
      loadMapModules()
        .then((modules) => {
          if (!disposed) init(modules)
        })
        .catch(() => {
          // A failed chunk fetch (dev dependency re-optimization, or stale hashes after a deploy)
          // would otherwise leave the card empty for good: retry a couple of times, then give up quietly.
          if (!disposed && attempt < 2) retryTimer = setTimeout(() => load(attempt + 1), 1000)
        })
    }

    const trigger = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        trigger.disconnect()
        load()
      },
      { rootMargin: '400px' },
    )
    trigger.observe(canvas)

    return () => {
      disposed = true
      trigger.disconnect()
      clearTimeout(retryTimer)
      cleanup()
    }
  }, [lat, lon, highlight])

  return <canvas ref={canvasRef} aria-hidden className={className} />
}
