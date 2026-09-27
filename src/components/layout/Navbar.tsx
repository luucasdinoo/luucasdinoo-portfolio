import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'
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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Borderless fade behind the header once content scrolls under it; keeps controls readable. */}
      <div
        aria-hidden
        className={`mockup pointer-events-none fixed inset-x-0 top-0 z-30 h-24 transition-opacity duration-200 ease-out sm:h-28 lg:h-170 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(to bottom, var(--surface) 55%, transparent)' }}
      />
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
    </>
  )
}
