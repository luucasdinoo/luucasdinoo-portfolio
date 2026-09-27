import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router'
import { locales, type Locale } from '../../i18n'
import { Flag } from './Flag'

// Language names in their own language, so each option is recognisable whatever the current UI language.
const autonyms: Record<Locale, { name: string; lang: string }> = {
  pt: { name: 'Português (Brasil)', lang: 'pt-BR' },
  en: { name: 'English (US)', lang: 'en-US' },
}

export function LocaleSwitch() {
  const { t } = useTranslation()
  const { locale } = useParams()
  const location = useLocation()

  const restOfPath = location.pathname.split('/').slice(2).join('/')

  return (
    <nav aria-label={t('locale.switchLabel')} className="flex items-center gap-2.5 lg:gap-16">
      {locales.map((code) => {
        const active = code === locale
        return (
          <Link
            key={code}
            to={`/${code}${restOfPath ? `/${restOfPath}` : ''}${location.hash}`}
            aria-label={autonyms[code].name}
            title={autonyms[code].name}
            lang={autonyms[code].lang}
            aria-current={active ? 'true' : undefined}
            className={`block h-4 w-6 overflow-hidden rounded-[3px] transition-opacity duration-150 lg:h-24 lg:w-36 lg:rounded-m-4 ${
              active ? 'opacity-100 ring-2 ring-accent' : 'opacity-45 ring-1 ring-line-strong hover:opacity-100'
            }`}
          >
            <Flag locale={code} />
          </Link>
        )
      })}
    </nav>
  )
}
