import { useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  timeZone: string
  city: string
}

const SYNODIC_MONTH = 29.530588853
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14)

function readTime(timeZone: string, locale: string) {
  const now = new Date()
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat(locale, {
      timeZone,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hourCycle: 'h23',
      weekday: 'short',
      day: 'numeric',
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  )
  const days = (now.getTime() - KNOWN_NEW_MOON) / 86_400_000
  return {
    h: Number(parts.hour),
    m: Number(parts.minute),
    s: Number(parts.second),
    weekday: String(parts.weekday).replace('.', '').slice(0, 3).toUpperCase(),
    day: String(parts.day),
    moonPhase: (((days / SYNODIC_MONTH) % 1) + 1) % 1,
  }
}

/** Lit part of the moon for phase p (0 new → 0.5 full → 1 new), radius r, centred at 0,0. */
function moonPath(p: number, r: number) {
  const k = Math.cos(2 * Math.PI * p)
  const rx = r * Math.abs(k)
  const waxing = p < 0.5
  const outer = waxing ? 1 : 0
  const terminator = waxing ? (k > 0 ? 0 : 1) : k > 0 ? 1 : 0
  return `M0 ${-r} A ${r} ${r} 0 0 ${outer} 0 ${r} A ${rx} ${r} 0 0 ${terminator} 0 ${-r} Z`
}

const hourMarkers = Array.from({ length: 12 }, (_, i) => i * 30)
const minuteTicks = Array.from({ length: 60 }, (_, i) => i).filter((i) => i % 5 !== 0)

export function WatchClock({ timeZone, city }: Props) {
  const { t, i18n } = useTranslation()
  const reducedMotion = useReducedMotion()
  const [time, setTime] = useState(() => readTime(timeZone, i18n.language))

  useEffect(() => {
    const update = () => setTime(readTime(timeZone, i18n.language))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [timeZone, i18n.language])

  const hourAngle = ((time.h % 12) + time.m / 60) * 30
  const minuteAngle = (time.m + time.s / 60) * 6
  const secondAngle = time.s * 6
  const label = t('about.clock.label', {
    time: `${String(time.h).padStart(2, '0')}:${String(time.m).padStart(2, '0')}`,
    city,
  })

  return (
    <svg
      viewBox="-100 -100 200 200"
      role="img"
      aria-label={label}
      className="h-full w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
    >
      <defs>
        <linearGradient id="watch-bezel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EEF2F8" />
          <stop offset="0.35" stopColor="#6B7486" />
          <stop offset="0.55" stopColor="#F4F7FB" />
          <stop offset="1" stopColor="#3F4757" />
        </linearGradient>
        <radialGradient id="watch-face" cx="0.5" cy="0.38" r="0.75">
          <stop offset="0" stopColor="#161C2A" />
          <stop offset="1" stopColor="#04060B" />
        </radialGradient>
        <radialGradient id="watch-glass" cx="0.35" cy="0.2" r="0.8">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.08" />
          <stop offset="0.6" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle r="98" fill="url(#watch-bezel)" />
      <circle r="91" fill="#0A0D14" />
      <circle r="87" fill="url(#watch-face)" />

      {minuteTicks.map((i) => (
        <line
          key={i}
          x1="0"
          y1="-83"
          x2="0"
          y2="-80"
          stroke="#5B6478"
          strokeWidth="0.7"
          transform={`rotate(${i * 6})`}
        />
      ))}
      {hourMarkers.map((deg) => (
        <g key={deg} transform={`rotate(${deg})`}>
          {deg === 0 ? (
            <>
              <rect x="-3.2" y="-82" width="2.4" height="13" rx="0.6" fill="#E8EDF5" />
              <rect x="0.8" y="-82" width="2.4" height="13" rx="0.6" fill="#E8EDF5" />
            </>
          ) : deg % 90 === 0 ? (
            <rect x="-1.4" y="-82" width="2.8" height="11" rx="0.6" fill="#E8EDF5" />
          ) : (
            <polygon points="-3.4,-81 3.4,-81 0,-70" fill="#E8EDF5" />
          )}
        </g>
      ))}

      {/* Moon-phase subdial at 9 o'clock. */}
      <g transform="translate(-44 0)">
        <text y="-19" textAnchor="middle" fontSize="4.2" letterSpacing="0.8" fill="#7C879C" fontFamily="var(--font-mono)">
          {t('about.clock.moon').toUpperCase()}
        </text>
        <circle r="14" fill="#05070C" stroke="#2A3345" strokeWidth="1" />
        <circle r="10.5" fill="#1A2233" />
        <path d={moonPath(time.moonPhase, 10.5)} fill="#C9D3E3" />
      </g>

      {/* Date window at 3 o'clock. */}
      <g transform="translate(46 0)">
        <text y="-12" textAnchor="middle" fontSize="4.2" letterSpacing="0.8" fill="#7C879C" fontFamily="var(--font-mono)">
          {time.weekday}
        </text>
        <rect x="-10" y="-7.5" width="20" height="15" rx="1.5" fill="#05070C" stroke="#2A3345" strokeWidth="1" />
        <text y="3.2" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#E8EDF5" fontFamily="var(--font-mono)">
          {time.day}
        </text>
      </g>

      <text y="34" textAnchor="middle" fontSize="4.6" letterSpacing="1.6" fill="#7C879C" fontFamily="var(--font-mono)">
        {city.toUpperCase()}
      </text>

      <g transform={`rotate(${hourAngle})`}>
        <path d="M-2.6 8 L-2.2 -40 L0 -48 L2.2 -40 L2.6 8 Z" fill="#E8EDF5" />
      </g>
      <g transform={`rotate(${minuteAngle})`}>
        <path d="M-1.8 10 L-1.5 -64 L0 -72 L1.5 -64 L1.8 10 Z" fill="#E8EDF5" />
      </g>
      {!reducedMotion && (
        <g transform={`rotate(${secondAngle})`}>
          <line x1="0" y1="16" x2="0" y2="-79" stroke="var(--accent)" strokeWidth="1" />
          <circle cy="12" r="2.2" fill="var(--accent)" />
        </g>
      )}
      <circle r="4.2" fill="#E8EDF5" />
      <circle r="1.7" fill="var(--accent)" />

      <circle r="87" fill="url(#watch-glass)" />
    </svg>
  )
}
