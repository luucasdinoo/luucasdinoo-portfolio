import type { TFunction } from 'i18next'
import type { Locale } from '../../i18n'

export { monthsElapsed } from '../../lib/duration'

const MONTHS: Record<Locale, string[]> = {
  pt: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
}

export function formatMonth(iso: string, locale: Locale): string {
  const [year, month] = iso.split('-').map(Number)
  return `${MONTHS[locale][month - 1]} ${year}`
}

export function formatDuration(totalMonths: number, t: TFunction): string {
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  const segments: string[] = []
  if (years > 0) segments.push(t('experience.duration.year', { count: years }))
  if (months > 0) segments.push(t('experience.duration.month', { count: months }))
  return segments.join(' ')
}
