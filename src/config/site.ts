import type { Locale } from '../i18n'

export const social = {
  github: 'https://github.com/luucasdinoo',
  linkedin: 'https://www.linkedin.com/in/lucas-bernadino',
  email: 'mailto:luucasdinoo@gmail.com',
}

export function cvHref(locale: Locale): string {
  return `/cv/lucas-bernadino-${locale}.pdf`
}

export const quickNavSections = [
  { id: 'sobre', labelKey: 'quicknav.about', icon: 'Users' },
  { id: 'experiencia', labelKey: 'quicknav.experience', icon: 'Clock' },
  { id: 'projetos', labelKey: 'quicknav.projects', icon: 'Code' },
  { id: 'skills', labelKey: 'quicknav.skills', icon: 'Wrench' },
  { id: 'contato', labelKey: 'quicknav.contact', icon: 'Send' },
] as const
