import { Award, CalendarDays, ChevronLeft, ChevronRight, ExternalLink, Pause, Play } from 'lucide-react'
import { motion, useInView, useReducedMotion, useScroll, useTransform, type TargetAndTransition } from 'motion/react'
import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { certifications, type Certification } from '../../content/certifications'
import { isLocale } from '../../i18n'
import { formatMonth } from '../experience/duration'
import { StackTag } from '../projects/parts'
import { Button } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'

const pad = (n: number) => String(n).padStart(2, '0')

// Time each certification stays in front while the carousel plays on its own.
const autoplayMs = 5000

function usePageVisible(): boolean {
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible')

  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])

  return visible
}

// No display utility here: callers pick `flex` or `hidden sm:flex`.
const roundButton =
  'h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-surface-raised/90 text-ink transition-colors duration-150 ease-out hover:border-accent hover:text-accent'

// Signed distance from the front card, wrapping around so the ring has no ends (-2 … +3 for six cards).
function ringOffset(index: number, active: number, total: number): number {
  let offset = (index - active + total) % total
  if (offset > total / 2) offset -= total
  return offset
}

// Coverflow pose per distance: neighbours turn their face to the centre, recede and fade to grey.
function pose(offset: number): TargetAndTransition {
  const depth = Math.abs(offset)
  const side = Math.sign(offset)
  if (depth === 0) return { x: '0%', z: 0, rotateY: 0, scale: 1, opacity: 1, filter: 'blur(0px) grayscale(0)' }
  if (depth === 1) return { x: `${side * 62}%`, z: -180, rotateY: side * -40, scale: 0.88, opacity: 0.75, filter: 'blur(2px) grayscale(1)' }
  if (depth === 2) return { x: `${side * 104}%`, z: -360, rotateY: side * -50, scale: 0.78, opacity: 0.4, filter: 'blur(4px) grayscale(1)' }
  return { x: `${side * 130}%`, z: -500, rotateY: side * -55, scale: 0.7, opacity: 0, filter: 'blur(6px) grayscale(1)' }
}

function CertificationCard({ certification, active }: { certification: Certification; active: boolean }) {
  const { t, i18n } = useTranslation()
  const locale = isLocale(i18n.language) ? i18n.language : 'pt'

  return (
    <article
      inert={!active}
      className={`flex h-full flex-col rounded-lg border bg-surface-raised p-3 transition-[border-color,box-shadow] duration-200 ease-out ${
        active ? 'border-accent/45 shadow-md' : 'border-line'
      }`}
    >
      <div className="aspect-[4/3] overflow-hidden rounded-md border border-line">
        {certification.image ? (
          <img src={certification.image} alt={certification.title} className="h-full w-full object-cover" />
        ) : (
          <div role="img" aria-label={certification.title} className="project-hatch flex h-full w-full flex-col items-center justify-center gap-3">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/45 bg-surface-raised text-accent">
              <Award aria-hidden size={28} strokeWidth={1.5} />
            </span>
            <span className="rounded-sm bg-surface-raised px-2 py-0.5 font-mono text-[12px] leading-4 tracking-[0.12em] text-accent-ink uppercase">
              {t('certifications.placeholder')}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate font-mono text-[12px] leading-4 font-semibold tracking-[0.12em] text-accent-ink uppercase">
            {certification.issuer}
          </p>
          <p
            title={t('certifications.issued', { date: formatMonth(certification.issued, locale) })}
            className="flex shrink-0 items-center gap-1.5 rounded-sm border border-line bg-surface px-2 py-0.5 font-mono text-[12px] leading-4 text-ink-subtle"
          >
            <CalendarDays aria-hidden size={13} strokeWidth={1.75} />
            {formatMonth(certification.issued, locale)}
          </p>
        </div>

        <h3 className="mt-3 font-display text-[20px] leading-[26px] font-semibold text-ink">{certification.title}</h3>
        <p className="mt-1 text-[12px] leading-4 text-ink-subtle">
          {certification.expires
            ? t('certifications.expires', { date: formatMonth(certification.expires, locale) })
            : t('certifications.noExpiry')}
        </p>
        <p className="mt-2 line-clamp-3 text-[14px] leading-[22px] text-ink-muted">{t(`certifications.items.${certification.key}`)}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {certification.skills.map((skill) => (
            <StackTag key={skill}>{skill}</StackTag>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
          {certification.credentialId && (
            <div className="min-w-0">
              <p className="font-mono text-[11px] leading-4 tracking-[0.12em] text-ink-subtle uppercase">{t('certifications.credentialId')}</p>
              <p className="truncate font-mono text-[12px] leading-4 text-ink-muted">{certification.credentialId}</p>
            </div>
          )}
          {certification.credentialUrl && (
            <Button href={certification.credentialUrl} target="_blank" rel="noreferrer" className="ml-auto">
              <ExternalLink aria-hidden size={16} strokeWidth={1.75} />
              {t('certifications.viewCredential')}
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

export function CertificationsSection() {
  const { t } = useTranslation()
  const reducedMotion = useReducedMotion()
  const headerRef = useRef<HTMLElement>(null)
  // The previous front card too, so a card wrapping from one end of the ring to the other jumps instead of sweeping across.
  const [[active, previous], setSlide] = useState([0, 0])
  const total = certifications.length

  // Header rises in with the scroll, same choreography as the About section.
  const { scrollYProgress } = useScroll({ target: headerRef, offset: ['start end', 'start 55%'] })
  const headerOpacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const headerY = useTransform(scrollYProgress, [0, 1], [48, 0])

  const go = (next: number) => setSlide([(next + total) % total, active])

  // Autoplay runs only while nobody is reading or steering it: it holds on hover, on keyboard focus,
  // off screen, in a hidden tab, under reduced motion, and after the pause button.
  const carouselRef = useRef<HTMLDivElement>(null)
  const inView = useInView(carouselRef, { amount: 0.4 })
  const pageVisible = usePageVisible()
  const [userPaused, setUserPaused] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const playing = !userPaused && !hovering && !focusWithin && inView && pageVisible && !reducedMotion

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => setSlide(([current]) => [(current + 1) % total, current]), autoplayMs)
    return () => window.clearTimeout(timer)
  }, [playing, active, total])

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') go(active - 1)
    if (event.key === 'ArrowRight') go(active + 1)
  }

  return (
    <section id="certificacoes" aria-labelledby="certifications-title" className="scroll-mt-28 overflow-x-clip px-4 py-16 sm:px-8 lg:px-28 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <motion.header
          ref={headerRef}
          style={reducedMotion ? undefined : { opacity: headerOpacity, y: headerY }}
          className="mb-8 flex flex-col gap-3 lg:mb-12"
        >
          <Eyebrow>{t('certifications.eyebrow')}</Eyebrow>
          <h2 id="certifications-title" className="font-display text-[32px] leading-[1.1] font-bold tracking-[-0.02em] text-ink lg:text-[40px]">
            {t('certifications.title')}
          </h2>
        </motion.header>

        <div
          ref={carouselRef}
          onPointerEnter={(event) => event.pointerType === 'mouse' && setHovering(true)}
          onPointerLeave={() => setHovering(false)}
          onFocus={() => setFocusWithin(true)}
          onBlur={onBlur}
        >
          <div
            role="region"
            aria-roledescription={t('certifications.roledescription')}
            aria-label={t('certifications.label')}
            onKeyDown={onKeyDown}
            className="relative"
          >
            <motion.div
              onPanEnd={(_, info) => {
                if (info.offset.x < -40) go(active + 1)
                if (info.offset.x > 40) go(active - 1)
              }}
              style={{ perspective: 1400, touchAction: 'pan-y' }}
              className="grid justify-items-center py-4"
            >
              {certifications.map((certification, index) => {
                const offset = ringOffset(index, active, total)
                const from = ringOffset(index, previous, total)
                const wrapped = from !== 0 && offset !== 0 && Math.sign(from) !== Math.sign(offset)
                const isActive = offset === 0

                return (
                  <motion.div
                    key={certification.key}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={t('certifications.slide', { n: index + 1, total })}
                    aria-hidden={!isActive}
                    onClick={isActive ? undefined : () => go(index)}
                    initial={false}
                    animate={pose(offset)}
                    transition={wrapped ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ zIndex: 10 - Math.abs(offset), transformStyle: 'preserve-3d' }}
                    className={`w-[min(340px,78vw)] [grid-area:1/1] ${isActive ? '' : 'cursor-pointer'}`}
                  >
                    <CertificationCard certification={certification} active={isActive} />
                  </motion.div>
                )
              })}
            </motion.div>

            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label={t('certifications.prev')}
              className={`${roundButton} absolute top-1/2 left-0 z-20 hidden -translate-y-1/2 sm:flex`}
            >
              <ChevronLeft aria-hidden size={22} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label={t('certifications.next')}
              className={`${roundButton} absolute top-1/2 right-0 z-20 hidden -translate-y-1/2 sm:flex`}
            >
              <ChevronRight aria-hidden size={22} strokeWidth={1.75} />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3 sm:gap-5">
            {/* On phones the arrows sit here, so they never cover the front card. */}
            <button type="button" onClick={() => go(active - 1)} aria-label={t('certifications.prev')} className={`${roundButton} flex sm:hidden`}>
              <ChevronLeft aria-hidden size={22} strokeWidth={1.75} />
            </button>
            <p aria-live={playing ? 'off' : 'polite'} className="font-mono text-[12px] leading-4 text-ink-subtle">
              <span className="text-[14px] font-semibold text-accent-ink">{pad(active + 1)}</span> / {pad(total)}
            </p>
            <div className="flex items-center gap-2">
              {certifications.map((certification, index) => (
                <button
                  key={certification.key}
                  type="button"
                  onClick={() => go(index)}
                  aria-label={t('certifications.goTo', { n: index + 1 })}
                  aria-current={index === active ? 'true' : undefined}
                  className={`relative h-2 cursor-pointer overflow-hidden rounded-full transition-[width,background-color] duration-200 ease-out ${
                    index === active ? (playing ? 'w-6 bg-line-strong' : 'w-6 bg-accent') : 'w-2 bg-line-strong hover:bg-accent'
                  }`}
                >
                  {/* While playing, the active pill fills up as the time to the next slide runs out. */}
                  {index === active && playing && (
                    <span
                      key={active}
                      aria-hidden
                      className="absolute inset-y-0 left-0 rounded-full bg-accent"
                      style={{ animation: `carousel-progress ${autoplayMs}ms linear forwards` }}
                    />
                  )}
                </button>
              ))}
            </div>
            {!reducedMotion && (
              <button
                type="button"
                onClick={() => setUserPaused((paused) => !paused)}
                aria-label={userPaused ? t('certifications.play') : t('certifications.pause')}
                className={`${roundButton} flex h-9 w-9`}
              >
                {userPaused ? <Play aria-hidden size={16} strokeWidth={1.75} /> : <Pause aria-hidden size={16} strokeWidth={1.75} />}
              </button>
            )}
            <button type="button" onClick={() => go(active + 1)} aria-label={t('certifications.next')} className={`${roundButton} flex sm:hidden`}>
              <ChevronRight aria-hidden size={22} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
