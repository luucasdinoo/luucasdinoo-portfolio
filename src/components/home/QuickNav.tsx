import { Clock, Code, Send, Users, Wrench } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { quickNavSections } from '../../config/site'
import { fadeRise } from './fadeRise'

const icons = { Users, Clock, Code, Wrench, Send }

export function QuickNav() {
  const { t } = useTranslation()

  return (
    <motion.nav
      {...fadeRise(0.2)}
      aria-label={t('quicknav.label')}
      className="flex w-screen snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 lg:w-auto lg:snap-none lg:gap-20 lg:overflow-visible lg:p-0"
    >
      {quickNavSections.map(({ id, labelKey, icon }) => {
        const Icon = icons[icon]
        return (
          <a
            key={id}
            href={`#${id}`}
            className="quicknav-card flex w-[132px] shrink-0 snap-start flex-col items-center gap-2 rounded-2xl border border-line bg-surface-raised/85 py-4 lg:w-200 lg:gap-12 lg:rounded-m-16 lg:py-24"
          >
            <Icon aria-hidden className="h-7 w-7 text-accent lg:h-40 lg:w-40" />
            <span className="font-sans text-[15px] font-semibold text-ink lg:text-m-26">{t(labelKey)}</span>
          </a>
        )
      })}
    </motion.nav>
  )
}
