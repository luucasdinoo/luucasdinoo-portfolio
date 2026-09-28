import type { Locale } from '../i18n'

export const social = {
  github: 'https://github.com/luucasdinoo',
  linkedin: 'https://www.linkedin.com/in/lucas-bernadino',
  email: 'mailto:luucasdinoo@gmail.com',
}

const cvFiles: Record<Locale, string> = {
  pt: '/cv/lucas-bernadino-pt.pdf',
  // No résumé translated yet for these: serve the Portuguese one instead of a broken link.
  en: '/cv/lucas-bernadino-pt.pdf',
  es: '/cv/lucas-bernadino-pt.pdf',
  de: '/cv/lucas-bernadino-pt.pdf',
}

export function cvHref(locale: Locale): string {
  return cvFiles[locale]
}

export const quickNavSections = [
  { id: 'sobre', labelKey: 'quicknav.about', icon: 'Users' },
  { id: 'experiencia', labelKey: 'quicknav.experience', icon: 'Clock' },
  { id: 'projetos', labelKey: 'quicknav.projects', icon: 'Code' },
  { id: 'skills', labelKey: 'quicknav.skills', icon: 'Wrench' },
  { id: 'contato', labelKey: 'quicknav.contact', icon: 'Send' },
] as const
