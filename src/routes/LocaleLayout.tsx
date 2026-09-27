import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useParams } from 'react-router'
import { AppBackground } from '../components/background/AppBackground'
import { Navbar } from '../components/layout/Navbar'
import { defaultLocale, isLocale } from '../i18n'

export function LocaleLayout() {
  const { locale } = useParams()
  const { i18n, t } = useTranslation()

  const valid = isLocale(locale)

  useEffect(() => {
    if (!valid) return
    if (i18n.language !== locale) void i18n.changeLanguage(locale)
    document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en'
    document.title = t('meta.title')
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', t('meta.description'))
  }, [locale, valid, i18n, t])

  if (!valid) return <Navigate to={`/${defaultLocale}`} replace />

  return (
    <>
      <AppBackground />
      <Navbar />
      <div className="relative z-10">
        <Outlet />
      </div>
    </>
  )
}
