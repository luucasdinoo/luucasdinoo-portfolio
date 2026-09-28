import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import type { Project } from '../../content/projects'
import { IconTile, ProjectShot, StackTag, StatusBadge, YearChip } from './parts'
import { projectNumber } from './projectNumber'

const visibleTags = 4

type ProjectCardProps = {
  project: Project
  index: number
  featured: boolean
  onOpen: () => void
}

export function ProjectCard({ project, index, featured, onOpen }: ProjectCardProps) {
  const { t } = useTranslation()
  const captions = t(`projects.items.${project.key}.shots`, { returnObjects: true }) as string[]
  const hidden = project.stack.length - visibleTags

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: (index % 2) * 0.08, ease: 'easeOut' }}
      className={`project-card relative flex flex-col rounded-lg border border-line bg-surface-raised/85 p-2 ${
        featured ? 'md:col-span-2 lg:grid lg:grid-cols-[1.25fr_1fr] lg:gap-2' : ''
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-line">
        <ProjectShot image={project.images[0]} caption={captions[0]} icon={project.icon} />
        <StatusBadge status={project.status} className="absolute top-3 right-3" />
        <IconTile icon={project.icon} className="absolute bottom-3 left-3" />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[12px] leading-4 font-semibold tracking-[0.12em] text-accent-ink">
            {projectNumber(index)}
          </span>
          <span aria-hidden className="h-px flex-1 bg-line" />
          <YearChip year={project.year} />
        </div>

        <h3
          className={`mt-4 font-display font-bold tracking-[-0.015em] text-ink ${
            featured ? 'text-[28px] leading-[34px] lg:text-[32px] lg:leading-[38px]' : 'text-[24px] leading-[30px]'
          }`}
        >
          {project.name}
        </h3>
        <p className="mt-3 line-clamp-3 text-[14px] leading-[22px] text-ink-muted lg:text-[15px] lg:leading-6">
          {t(`projects.items.${project.key}.summary`)}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {project.stack.slice(0, visibleTags).map((tech) => (
            <StackTag key={tech}>{tech}</StackTag>
          ))}
          {hidden > 0 && <StackTag>{t('projects.moreTech', { count: hidden })}</StackTag>}
        </ul>

        {/* The button's ::after covers the card, so the whole card opens the modal. */}
        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          className="group/cta mt-auto flex cursor-pointer items-center gap-3 self-start pt-6 font-mono text-[12px] leading-4 font-semibold tracking-[0.12em] text-ink uppercase outline-none after:absolute after:inset-0 after:rounded-lg"
        >
          {t('projects.viewDetails')}
          <span className="sr-only">: {project.name}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line-strong text-ink-muted transition-colors duration-150 ease-out group-hover/cta:border-accent group-hover/cta:text-accent">
            <ArrowUpRight aria-hidden size={14} strokeWidth={2} />
          </span>
        </button>
      </div>
    </motion.article>
  )
}
