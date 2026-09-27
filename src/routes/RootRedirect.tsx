import { Navigate } from 'react-router'
import { defaultLocale, isLocale } from '../i18n'

export function RootRedirect() {
  const browserLocale = navigator.language.slice(0, 2)
  const target = isLocale(browserLocale) ? browserLocale : defaultLocale
  return <Navigate to={`/${target}`} replace />
}
