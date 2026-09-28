import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { projects } from '../../content/projects'
import { Eyebrow } from '../ui/Eyebrow'
import { ProjectCard } from './ProjectCard'
import { ProjectModal } from './ProjectModal'

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
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <ProjectModal key={projects[openIndex].key} project={projects[openIndex]} index={openIndex} onClose={() => setOpenIndex(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
