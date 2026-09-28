import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import de from './messages/de.json'
import en from './messages/en.json'
import es from './messages/es.json'
import pt from './messages/pt.json'

export const locales = ['pt', 'en', 'es', 'de'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'pt'

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (locales as readonly string[]).includes(value)
}

void i18n.use(initReactI18next).init({
  resources: {
    pt: { translation: pt },
    en: { translation: en },
    es: { translation: es },
    de: { translation: de },
  },
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  interpolation: { escapeValue: false },
})

export default i18n
