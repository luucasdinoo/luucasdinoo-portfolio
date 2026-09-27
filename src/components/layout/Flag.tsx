import type { Locale } from '../../i18n'

const className = 'block h-full w-full'

function BrazilFlag() {
  return (
    <svg viewBox="0 0 20 14" preserveAspectRatio="xMidYMid slice" aria-hidden className={className}>
      <rect width="20" height="14" fill="#009C3B" />
      <polygon points="10,1.6 18.4,7 10,12.4 1.6,7" fill="#FFDF00" />
      <circle cx="10" cy="7" r="3.5" fill="#002776" />
      <path d="M6.55 6.35a3.5 3.5 0 0 1 6.9 1.25" fill="none" stroke="#FFFFFF" strokeWidth="0.6" />
    </svg>
  )
}

function UsaFlag() {
  const stripe = 10 / 13
  return (
    <svg viewBox="0 0 19 10" preserveAspectRatio="xMidYMid slice" aria-hidden className={className}>
      <rect width="19" height="10" fill="#B22234" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} y={stripe * (2 * i + 1)} width="19" height={stripe} fill="#FFFFFF" />
      ))}
      <rect width="7.6" height={stripe * 7} fill="#3C3B6E" />
      {Array.from({ length: 20 }, (_, i) => (
        <circle key={i} cx={0.9 + (i % 5) * 1.45} cy={0.75 + Math.floor(i / 5) * 1.25} r="0.28" fill="#FFFFFF" />
      ))}
    </svg>
  )
}

export function Flag({ locale }: { locale: Locale }) {
  return locale === 'pt' ? <BrazilFlag /> : <UsaFlag />
}
