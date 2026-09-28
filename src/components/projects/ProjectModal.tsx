import { ChevronLeft, ChevronRight, Code2, Globe, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import type { Project } from '../../content/projects'
import { Button } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'
import { IconTile, ProjectShot, StackTag, StatusDot } from './parts'
import { projectNumber } from './projectNumber'

const pad = (n: number) => String(n).padStart(2, '0')

const roundButton =
  'flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-surface-raised/90 text-ink transition-colors duration-150 ease-out hover:border-accent hover:text-accent'

const focusable = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function Carousel({ project }: { project: Project }) {
  const { t } = useTranslation()
  const captions = t(`projects.items.${project.key}.shots`, { returnObjects: true }) as string[]
  const [[current, direction], setSlide] = useState([0, 0])
  const total = captions.length

  const go = (next: number) => setSlide([(next + total) % total, next > current ? 1 : -1])

  // Arrow keys work wherever focus sits inside the open modal.
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'ArrowLeft') setSlide(([i]) => [(i - 1 + total) % total, -1])
      if (event.key === 'ArrowRight') setSlide(([i]) => [(i + 1) % total, 1])
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [total])

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-line bg-surface sm:aspect-[16/9]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 48 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -48 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <ProjectShot image={project.images[current]} caption={captions[current]} icon={project.icon} showLabel />
          </motion.div>
        </AnimatePresence>

        {/* Viewfinder corners. */}
        <span aria-hidden className="pointer-events-none absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2 border-accent" />
        <span aria-hidden className="pointer-events-none absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2 border-accent" />
        <span aria-hidden className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-accent" />
        <span aria-hidden className="pointer-events-none absolute right-3 bottom-3 h-4 w-4 border-r-2 border-b-2 border-accent" />

        {total > 1 && (
          <>
            <button type="button" onClick={() => go(current - 1)} aria-label={t('projects.modal.prev')} className={`${roundButton} absolute top-1/2 left-4 -translate-y-1/2`}>
              <ChevronLeft aria-hidden size={20} strokeWidth={1.75} />
            </button>
            <button type="button" onClick={() => go(current + 1)} aria-label={t('projects.modal.next')} className={`${roundButton} absolute top-1/2 right-4 -translate-y-1/2`}>
              <ChevronRight aria-hidden size={20} strokeWidth={1.75} />
            </button>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <p aria-live="polite" className="font-mono text-[12px] leading-4 text-ink-subtle">
          <span className="text-[14px] font-semibold text-accent-ink">{pad(current + 1)}</span> / {pad(total)}
        </p>
        {total > 1 && (
          <div className="flex items-center gap-2">
            {captions.map((caption, i) => (
              <button
                key={caption}
                type="button"
                onClick={() => go(i)}
                aria-label={t('projects.modal.goTo', { n: i + 1 })}
                aria-current={i === current ? 'true' : undefined}
                className={`h-2 cursor-pointer rounded-full transition-[width,background-color] duration-200 ease-out ${
                  i === current ? 'w-6 bg-accent' : 'w-2 bg-line-strong hover:bg-accent'
                }`}
              />
            ))}
          </div>
        )}
        <p className="min-w-0 flex-1 truncate text-right font-mono text-[12px] leading-4 text-ink-subtle">{captions[current]}</p>
      </div>
    </div>
  )
}

type ProjectModalProps = {
  project: Project
  index: number
  onClose: () => void
}

export function ProjectModal({ project, index, onClose }: ProjectModalProps) {
  const { t } = useTranslation()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const overview = t(`projects.items.${project.key}.overview`, { returnObjects: true }) as string[]
  const shots = (t(`projects.items.${project.key}.shots`, { returnObjects: true }) as string[]).length
  const titleId = `project-${project.key}-title`

  // Modal behaviour: page behind goes inert and stops scrolling; focus moves in and returns on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const root = document.getElementById('root')
    const html = document.documentElement
    root?.setAttribute('inert', '')
    html.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      root?.removeAttribute('inert')
      html.style.overflow = ''
      opener?.focus()
    }
  }, [])

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') return onClose()
    if (event.key !== 'Tab' || !panelRef.current) return
    const items = [...panelRef.current.querySelectorAll<HTMLElement>(focusable)]
    const first = items[0]
    const last = items[items.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return createPortal(
    <div onKeyDown={onKeyDown} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-8">
      <motion.div
        aria-hidden
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute inset-0 bg-surface/75 backdrop-blur-md"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative flex max-h-full w-full max-w-[1040px] flex-col overflow-hidden rounded-lg border border-accent/45 bg-surface-raised shadow-md"
      >
        <header className="flex items-center gap-4 border-b border-line px-4 py-4 sm:px-6">
          <IconTile icon={project.icon} />
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-x-2 font-mono text-[12px] leading-4 font-semibold tracking-[0.12em] uppercase">
              <span className="text-accent-ink">{projectNumber(index)}</span>
              <span aria-hidden className="text-ink-subtle">—</span>
              <span className="text-ink-subtle">{project.year}</span>
              <span className="flex items-center gap-1.5 text-ink">
                <StatusDot status={project.status} />
                {t(`projects.status.${project.status}`)}
              </span>
            </p>
            <h2 id={titleId} className="mt-1 truncate font-display text-[24px] leading-[30px] font-bold tracking-[-0.015em] text-ink sm:text-[32px] sm:leading-[38px]">
              {project.name}
            </h2>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={t('projects.modal.close')} className={roundButton}>
            <X aria-hidden size={20} strokeWidth={1.75} />
          </button>
        </header>

        <div className="overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <Carousel project={project} />

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
            <section>
              <Eyebrow>{t('projects.modal.overview')}</Eyebrow>
              <div className="mt-4 flex max-w-[68ch] flex-col gap-4 text-[16px] leading-[26px] text-ink-muted">
                {overview.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <aside className="flex flex-col gap-5">
              <dl className="grid grid-cols-3 divide-x divide-line rounded-lg border border-line bg-surface">
                {[
                  [t('projects.modal.year'), String(project.year)],
                  [t('projects.modal.stack'), pad(project.stack.length)],
                  [t('projects.modal.shots'), pad(shots)],
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-1 px-3 py-3 sm:px-4">
                    <dt className="font-mono text-[11px] leading-4 tracking-[0.12em] text-ink-subtle uppercase">{label}</dt>
                    <dd className="font-display text-[18px] leading-6 font-bold text-ink">{value}</dd>
                  </div>
                ))}
              </dl>

              {(project.liveUrl || project.repoUrl) && (
                <div className="flex flex-col gap-3">
                  {project.liveUrl && (
                    <Button size="lg" href={project.liveUrl} target="_blank" rel="noreferrer" className="w-full">
                      <Globe aria-hidden size={18} strokeWidth={1.75} />
                      {t('projects.modal.visitSite')}
                    </Button>
                  )}
                  {project.repoUrl && (
                    <Button size="lg" variant={project.liveUrl ? 'secondary' : 'primary'} href={project.repoUrl} target="_blank" rel="noreferrer" className="w-full">
                      <Code2 aria-hidden size={18} strokeWidth={1.75} />
                      {t('projects.modal.viewCode')}
                    </Button>
                  )}
                </div>
              )}

              <div>
                <Eyebrow>{t('projects.modal.builtWith')}</Eyebrow>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <StackTag key={tech}>{tech}</StackTag>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  )
}
