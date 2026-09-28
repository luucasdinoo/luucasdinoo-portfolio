import { CalendarDays, Download, FolderGit2, GraduationCap, Quote, Server, Zap } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { cvHref } from '../../config/site'
import { about } from '../../content/about'
import { isLocale } from '../../i18n'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Eyebrow } from '../ui/Eyebrow'
import { WorldGlobe } from './WorldGlobe'
import { WatchClock } from './WatchClock'

const statIcons = { FolderGit2, CalendarDays, Server, Zap }

// In progress reads as a tinted tag; completed as a quiet outline (design system: tags use accent-soft + accent-ink).
const statusStyles = {
  inProgress: 'border-transparent bg-accent-soft text-accent-ink',
  completed: 'border-line-strong text-ink-muted',
}

export function AboutSection() {
  const { t } = useTranslation()
  const { locale } = useParams()
  const currentLocale = isLocale(locale) ? locale : 'pt'
  const reducedMotion = useReducedMotion()
  const headerRef = useRef<HTMLElement>(null)

  // Header rises in with the scroll as the hero hands over (0 = just entering, 1 = settled).
  const { scrollYProgress } = useScroll({ target: headerRef, offset: ['start end', 'start 55%'] })
  const headerOpacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const headerY = useTransform(scrollYProgress, [0, 1], [48, 0])

  return (
    <section id="sobre" aria-labelledby="about-title" className="scroll-mt-28 px-4 py-16 sm:px-8 lg:px-28 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <motion.header
          ref={headerRef}
          style={reducedMotion ? undefined : { opacity: headerOpacity, y: headerY }}
          className="mb-8 flex flex-col gap-3 lg:mb-12"
        >
          <Eyebrow>{t('about.eyebrow')}</Eyebrow>
          <h2 id="about-title" className="font-display text-[32px] leading-[1.1] font-bold tracking-[-0.02em] text-ink lg:text-[40px]">
            {t('about.title')}
          </h2>
        </motion.header>

        <div className="relative grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-6 lg:gap-4">
          {/* Profile */}
          <Card index={0} className="md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-accent font-display text-[28px] font-semibold text-accent">
                {about.initials}
              </div>
              <div>
                <p className="font-display text-[24px] leading-[30px] font-semibold tracking-[-0.01em] text-accent">{about.name}</p>
                <p className="text-[14px] leading-5 text-ink-muted">{t('about.role')}</p>
              </div>
            </div>
            <p className="mt-6 text-[17px] leading-7 text-ink-muted">{t('about.bio')}</p>
          </Card>

          {/* Location */}
          <Card index={1} className="min-h-[300px] overflow-hidden lg:col-span-2">
            <div className="relative z-10 flex flex-col gap-3">
              <Eyebrow>{t('about.location.eyebrow')}</Eyebrow>
              <p className="font-display text-[20px] leading-7 font-semibold text-ink">
                <Trans
                  i18nKey="about.location.title"
                  values={{ city: about.location.city }}
                  components={{ muted: <span className="text-ink-muted" /> }}
                />
              </p>
            </div>
            <WorldGlobe
              lat={about.location.lat}
              lon={about.location.lon}
              className="pointer-events-none absolute top-[30%] left-1/2 aspect-square w-full -translate-x-1/2"
            />
          </Card>

          {/* Education */}
          <Card index={2} className="flex flex-col lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-soft text-accent-ink">
                <GraduationCap aria-hidden size={20} strokeWidth={1.75} />
              </span>
              <Eyebrow>{t('about.education.eyebrow')}</Eyebrow>
            </div>
            <ul className="mt-6 flex flex-col gap-3 lg:mt-auto lg:pt-6">
              {about.education.map(({ institution, degree, status, period }) => (
                <li key={institution} className="rounded-md border border-line bg-surface p-4">
                  <p className="font-display text-[17px] leading-6 font-semibold text-ink">{institution}</p>
                  <p className="mt-1 text-[14px] leading-5 text-ink-muted">{t(`about.education.degrees.${degree}`)}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-[12px] leading-4 text-ink-subtle">{period}</p>
                    <span className={`shrink-0 rounded-sm border px-2 py-0.5 font-mono text-[12px] leading-4 font-medium ${statusStyles[status]}`}>
                      {t(`about.education.status.${status}`)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Watch: its own block when stacked; overlaid on the row-2 seam on desktop. */}
          <div className="flex justify-center py-2 md:col-span-2 lg:pointer-events-none lg:relative lg:z-10 lg:col-span-2 lg:col-start-3 lg:row-start-2 lg:py-0">
            <div className="h-[240px] w-[240px] lg:absolute lg:top-1/2 lg:left-1/2 lg:h-[300px] lg:w-[300px] lg:-translate-x-1/2 lg:-translate-y-1/2">
              <WatchClock timeZone={about.location.timeZone} city={about.location.city} />
            </div>
          </div>

          {/* Call to action */}
          <Card index={3} tone="accent" className="md:col-span-2 lg:col-span-3 lg:col-start-1 lg:row-start-2 lg:pr-44">
            <p className="flex items-center gap-2 font-mono text-[12px] leading-4 font-semibold tracking-[0.12em] text-accent-ink uppercase">
              <span className="status-pulse-dot h-2 w-2 rounded-full bg-accent" aria-hidden />
              {t('about.cta.status')}
            </p>
            <p className="mt-4 font-display text-[28px] leading-[34px] font-bold tracking-[-0.015em] text-ink">
              {t('about.cta.line1')}
              <br />
              <span className="text-accent">{t('about.cta.line2')}</span>
            </p>
            <p className="font-display text-[20px] leading-7 text-ink-muted italic">{t('about.cta.line3')}</p>
            <Button variant="secondary" href={cvHref(currentLocale)} download className="mt-6">
              <Download aria-hidden size={18} strokeWidth={1.75} />
              {t('about.cta.button')}
            </Button>
          </Card>

          {/* Quote */}
          <Card index={4} className="flex flex-col justify-center md:col-span-2 lg:col-span-3 lg:col-start-4 lg:row-start-2 lg:pl-44">
            <Quote aria-hidden size={44} strokeWidth={1.5} className="absolute top-5 right-6 text-accent opacity-20" />
            <figure>
              <blockquote className="font-display text-[24px] leading-[30px] font-semibold text-accent italic">
                “{t('about.quote.text')}”
              </blockquote>
              <figcaption className="mt-5 border-t border-line pt-4 font-mono text-[12px] leading-4 tracking-[0.12em] text-ink-subtle uppercase">
                {t('about.quote.author')}
              </figcaption>
            </figure>
          </Card>

          {/* Stats */}
          <Card index={5} className="md:col-span-2 lg:col-span-6 lg:row-start-3 lg:pt-10">
            <h3 className="sr-only">{t('about.stats.label')}</h3>
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-5">
              {about.stats.map(({ key, value, icon }) => {
                const Icon = statIcons[icon]
                return (
                  <li
                    key={key}
                    className="relative flex flex-col items-center gap-3 overflow-hidden rounded-lg border border-line bg-surface px-3 py-7"
                  >
                    <div aria-hidden className="about-stat-glow pointer-events-none absolute inset-0" />
                    <div className="relative flex h-24 w-24 items-center justify-center">
                      <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-accent">
                        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="0.5 7" strokeLinecap="round" opacity="0.55" />
                      </svg>
                      <span className="font-display text-[32px] leading-[38px] font-bold tracking-[-0.015em] text-accent">{value}</span>
                    </div>
                    <span className="relative flex items-center gap-2 text-center text-[14px] leading-5 font-semibold text-ink-muted">
                      <Icon aria-hidden size={16} strokeWidth={1.75} className="shrink-0 text-accent" />
                      {t(`about.stats.${key}`)}
                    </span>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  )
}
