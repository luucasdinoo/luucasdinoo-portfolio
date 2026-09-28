import { BellRing, CalendarDays, Clapperboard, CreditCard } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Project, ProjectIcon } from '../../content/projects'

const icons: Record<ProjectIcon, typeof CreditCard> = { CreditCard, Clapperboard, BellRing }

export function IconTile({ icon, className = '' }: { icon: ProjectIcon; className?: string }) {
  const Icon = icons[icon]
  return (
    <span
      aria-hidden
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-accent/45 bg-surface-raised text-accent ${className}`}
    >
      <Icon size={20} strokeWidth={1.75} />
    </span>
  )
}

export function StatusDot({ status }: { status: Project['status'] }) {
  return (
    <span
      aria-hidden
      className={`h-2 w-2 shrink-0 rounded-full ${status === 'live' ? 'status-pulse-dot bg-accent' : 'bg-ink-subtle'}`}
    />
  )
}

export function StatusBadge({ status, className = '' }: { status: Project['status']; className?: string }) {
  const { t } = useTranslation()
  return (
    <span
      className={`flex items-center gap-2 rounded-full border border-line bg-surface-raised/90 px-3 py-1 font-mono text-[12px] leading-4 font-semibold tracking-[0.12em] text-ink uppercase backdrop-blur-sm ${className}`}
    >
      <StatusDot status={status} />
      {t(`projects.status.${status}`)}
    </span>
  )
}

export function YearChip({ year }: { year: number }) {
  return (
    <span className="flex items-center gap-1.5 rounded-sm border border-line bg-surface px-2 py-0.5 font-mono text-[12px] leading-4 text-ink-subtle">
      <CalendarDays aria-hidden size={13} strokeWidth={1.75} />
      {year}
    </span>
  )
}

export function StackTag({ children }: { children: string }) {
  return (
    <li className="rounded-sm border border-line bg-surface px-2 py-0.5 font-mono text-[12px] leading-4 text-ink-muted">{children}</li>
  )
}

type ShotProps = {
  image?: string
  caption: string
  icon: ProjectIcon
  showLabel?: boolean
}

// A real screenshot when there is one, otherwise the design system's hatched placeholder.
export function ProjectShot({ image, caption, icon, showLabel = false }: ShotProps) {
  const { t } = useTranslation()
  if (image) return <img src={image} alt={caption} className="h-full w-full object-cover" />

  const Icon = icons[icon]
  return (
    <div role="img" aria-label={caption} className="project-hatch flex h-full w-full flex-col items-center justify-center gap-3">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/45 bg-surface-raised text-accent">
        <Icon aria-hidden size={28} strokeWidth={1.5} />
      </span>
      {showLabel && (
        <span className="rounded-sm bg-surface-raised px-2 py-0.5 font-mono text-[12px] leading-4 tracking-[0.12em] text-accent-ink uppercase">
          {t('projects.modal.placeholder')}
        </span>
      )}
    </div>
  )
}
