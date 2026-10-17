import { Construction } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { projects } from '../../content/projects'
import { Eyebrow } from '../ui/Eyebrow'
import { ProjectCard } from './ProjectCard'
import { ProjectModal } from './ProjectModal'

// While true the section shows an "under construction" notice instead of the project grid.
const underConstruction = true

function UnderConstruction() {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="rounded-lg border border-line bg-surface-raised/85 p-2"
    >
      <div className="project-hatch flex flex-col items-center gap-5 rounded-md border border-line px-6 py-16 text-center sm:py-20">
        <span className="flex items-center gap-2 rounded-full border border-line bg-surface-raised/90 px-3 py-1 font-mono text-[12px] leading-4 font-semibold tracking-[0.12em] text-ink uppercase backdrop-blur-sm">
          <span aria-hidden className="status-pulse-dot h-2 w-2 shrink-0 rounded-full bg-accent" />
          {t('projects.wip.badge')}
        </span>
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/45 bg-surface-raised text-accent">
          <Construction aria-hidden size={28} strokeWidth={1.5} />
        </span>
        <div className="flex max-w-[480px] flex-col gap-3 rounded-md bg-surface-raised/90 px-4 py-3 backdrop-blur-sm">
          <h3 className="font-display text-[24px] leading-[30px] font-bold tracking-[-0.015em] text-ink">{t('projects.wip.title')}</h3>
          <p className="text-[14px] leading-[22px] text-ink-muted lg:text-[15px] lg:leading-6">{t('projects.wip.description')}</p>
        </div>
      </div>
    </motion.div>
  )
}

export function ProjectsSection() {
  const { t } = useTranslation()
  const reducedMotion = useReducedMotion()
  const headerRef = useRef<HTMLElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Header rises in with the scroll, same choreography as the About section.
  const { scrollYProgress } = useScroll({ target: headerRef, offset: ['start end', 'start 55%'] })
  const headerOpacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const headerY = useTransform(scrollYProgress, [0, 1], [48, 0])

  return (
    <section id="projetos" aria-labelledby="projects-title" className="scroll-mt-28 px-4 py-16 sm:px-8 lg:px-28 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <motion.header
          ref={headerRef}
          style={reducedMotion ? undefined : { opacity: headerOpacity, y: headerY }}
          className="mb-8 flex flex-col gap-3 lg:mb-12"
        >
          <Eyebrow>{t('projects.eyebrow')}</Eyebrow>
          <h2 id="projects-title" className="font-display text-[32px] leading-[1.1] font-bold tracking-[-0.02em] text-ink lg:text-[40px]">
            {t('projects.title')}
          </h2>
        </motion.header>

        {underConstruction ? (
          <UnderConstruction />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.key}
                project={project}
                index={index}
                featured={index === 0}
                onOpen={() => setOpenIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <ProjectModal key={projects[openIndex].key} project={projects[openIndex]} index={openIndex} onClose={() => setOpenIndex(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
