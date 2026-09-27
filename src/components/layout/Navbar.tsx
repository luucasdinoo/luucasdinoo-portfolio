import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { cvHref } from '../../config/site'
import { isLocale } from '../../i18n'
import { Button } from '../ui/Button'
import { IconLink } from '../ui/IconButton'
import { LocaleSwitch } from './LocaleSwitch'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  const { t } = useTranslation()
  const { locale } = useParams()
  const currentLocale = isLocale(locale) ? locale : 'pt'

  return (
    <header className="navbar-fade mockup fixed inset-x-3 top-3 z-40 sm:inset-x-6 sm:top-6 lg:top-32 lg:right-64 lg:left-64">
      <div className="flex h-14 items-center gap-3 pr-2 pl-4 sm:gap-5 lg:h-88 lg:gap-40 lg:pr-16 lg:pl-32">
        <p className="font-display text-[18px] font-bold whitespace-nowrap text-ink sm:text-[20px] lg:text-m-30">
          <span className="sm:hidden">LB</span>
        </p>
        <div className="flex-1" />
        <LocaleSwitch />
        <ThemeToggle />
        <span className="hidden sm:inline-flex">
          <Button size="mockup" href={cvHref(currentLocale)} download>
            {t('nav.downloadCv')}
          </Button>
        </span>
        <IconLink kind="nav" href={cvHref(currentLocale)} download aria-label={t('nav.downloadCv')} className="sm:hidden">
          <Download aria-hidden className="h-5 w-5" />
        </IconLink>
      </div>
    </header>
  )
}
