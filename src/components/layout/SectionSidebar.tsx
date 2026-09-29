import { ArrowUp, Award, Clock, Code, Send, Users, Wrench } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { quickNavSections } from '../../config/site'
import type { SectionId } from '../../hooks/useActiveSection'

const icons = { Users, Clock, Code, Award, Wrench, Send }

const itemClass =
  'flex h-10 w-10 items-center justify-center rounded-md transition-colors duration-150 ease-out'

function Tooltip({ number, label }: { number?: string; label: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute top-1/2 right-full mr-3 flex -translate-y-1/2 items-center gap-2 rounded-md border border-line bg-surface-raised px-3 py-1.5 whitespace-nowrap opacity-0 shadow-sm transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-within:opacity-100"
    >
      {number && <span className="font-mono text-[12px] leading-4 font-semibold tracking-[0.12em] text-accent-ink">{number}</span>}
      <span className="text-[14px] leading-5 font-semibold text-ink">{label}</span>
    </span>
  )
}

// Section rail for every screen but the hero: sits on the right (the left belongs to the social rail), appears once the hero hands over, tracks the section in view.
export function SectionSidebar({ active }: { active: SectionId | null }) {
  const { t } = useTranslation()

  return (
    <AnimatePresence>
      {active && (
        <motion.nav
          aria-label={t('sidebar.label')}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed top-1/2 right-6 z-30 hidden -translate-y-1/2 lg:block"
        >
          <ul className="flex flex-col gap-1 rounded-lg border border-line bg-surface-raised/85 p-2 shadow-sm backdrop-blur-md">
            <li className="group relative">
              <a href="#top" aria-label={t('sidebar.top')} className={`${itemClass} text-ink-muted hover:text-accent`}>
                <ArrowUp aria-hidden size={20} strokeWidth={1.75} />
              </a>
              <Tooltip label={t('sidebar.top')} />
            </li>

            <li aria-hidden className="mx-2 my-1 h-px bg-line" />

            {quickNavSections.map(({ id, labelKey, icon }, index) => {
              const Icon = icons[icon]
              const current = id === active
              return (
                <li key={id} className="group relative">
                  <a
                    href={`#${id}`}
                    aria-label={t(labelKey)}
                    aria-current={current ? 'location' : undefined}
                    className={`${itemClass} ${current ? 'bg-accent-soft text-accent-ink' : 'text-ink-muted hover:text-accent'}`}
                  >
                    <Icon aria-hidden size={20} strokeWidth={1.75} />
                  </a>
                  <Tooltip number={String(index + 1).padStart(2, '0')} label={t(labelKey)} />
                </li>
              )
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
