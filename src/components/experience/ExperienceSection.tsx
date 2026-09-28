import { CalendarDays, ChevronRight, MapPin } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import avanadeLogo from '../../assets/logos/avanade.jpeg'
import capgeminiLogo from '../../assets/logos/capgemini.png'
import compassuolLogo from '../../assets/logos/compassuol.png'
import { experience } from '../../content/experience'
import { isLocale } from '../../i18n'
import { Card } from '../ui/Card'
import { Eyebrow } from '../ui/Eyebrow'
import { formatDuration, formatMonth, monthsElapsed } from './duration'

const logos: Record<(typeof experience.jobs)[number]['key'], string> = {
  capgemini: capgeminiLogo,
  avanade: avanadeLogo,
  compassuol: compassuolLogo,
}

export function ExperienceSection() {
  const { t, i18n } = useTranslation()
  const locale = isLocale(i18n.language) ? i18n.language : 'pt'
  const reducedMotion = useReducedMotion()
  const headerRef = useRef<HTMLElement>(null)

  // Header rises in with the scroll, same choreography as the About section.
  const { scrollYProgress } = useScroll({ target: headerRef, offset: ['start end', 'start 55%'] })
  const headerOpacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const headerY = useTransform(scrollYProgress, [0, 1], [48, 0])

  return (
    <section id="experiencia" aria-labelledby="experience-title" className="scroll-mt-28 px-4 py-16 sm:px-8 lg:px-28 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <motion.header
          ref={headerRef}
          style={reducedMotion ? undefined : { opacity: headerOpacity, y: headerY }}
          className="mb-8 flex flex-col gap-3 lg:mb-12"
        >
          <Eyebrow>{t('experience.eyebrow')}</Eyebrow>
          <h2
            id="experience-title"
            className="font-display text-[32px] leading-[1.1] font-bold tracking-[-0.02em] text-ink lg:text-[40px]"
          >
            {t('experience.title')}
          </h2>
        </motion.header>

        <ol className="flex flex-col">
          {experience.jobs.map((job, index) => {
            const current = job.end === null
            const duration = formatDuration(monthsElapsed(job.start, job.end), t)
            const isLast = index === experience.jobs.length - 1

            return (
              <li key={job.key} className="flex gap-4 sm:gap-6">
                <div className="flex flex-col items-center">
                  <span
                    aria-hidden
                    className={`status-pulse-dot mt-6 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                      current ? 'border-accent bg-accent' : 'border-line-strong bg-surface'
                    }`}
                  />
                  {!isLast && <span aria-hidden className="w-px flex-1 bg-line" />}
                </div>

                <div className={`min-w-0 flex-1 ${isLast ? '' : 'pb-6'}`}>
                  <Card index={index} tone={current ? 'accent' : 'default'}>
                    <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                      <div className="flex items-start gap-4">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-line">
                          <img src={logos[job.key]} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-display text-[20px] leading-[26px] font-semibold text-ink">
                            {t(`experience.jobs.${job.key}.role`)}
                          </h3>
                          <p className="mt-0.5 text-[14px] leading-5 font-medium text-accent-ink">{job.company}</p>
                          <p className="mt-1 flex items-center gap-1.5 text-[13px] leading-4 text-ink-subtle italic">
                            <MapPin aria-hidden size={13} strokeWidth={1.75} className="shrink-0 not-italic" />
                            {t(`experience.jobs.${job.key}.location`)}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
                        <p className="flex items-center gap-1.5 font-mono text-[12px] leading-4 text-ink-subtle">
                          <CalendarDays aria-hidden size={14} strokeWidth={1.75} />
                          {formatMonth(job.start, locale)} – {current ? t('experience.present') : formatMonth(job.end!, locale)}
                        </p>
                        <span
                          className={`rounded-sm border px-2 py-0.5 font-mono text-[11px] leading-4 font-medium ${
                            current ? 'border-transparent bg-accent-soft text-accent-ink' : 'border-line-strong text-ink-muted'
                          }`}
                        >
                          {duration}
                        </span>
                      </div>
                    </div>

                    <p className="mt-4 text-[15px] leading-6 text-ink-muted">{t(`experience.jobs.${job.key}.description`)}</p>

                    <ul className="mt-4 flex flex-wrap gap-2">
                      {job.stack.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-sm border border-line bg-surface px-2 py-0.5 font-mono text-[12px] leading-4 text-ink-muted"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>

                    <ul className="mt-5 flex flex-col gap-2.5 border-t border-line pt-5">
                      {(t(`experience.jobs.${job.key}.bullets`, { returnObjects: true }) as string[]).map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2 text-[14px] leading-[22px] text-ink-muted">
                          <ChevronRight aria-hidden size={15} strokeWidth={2} className="mt-1 shrink-0 text-accent" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
