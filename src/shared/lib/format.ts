import { intlLocale } from '../../i18n/lang'
import { messages } from '../../i18n/useT'

export function formatMileage(mileage: number): string {
  return `${mileage.toLocaleString(intlLocale())} ${messages().units.km}`
}

export function formatMoney(sum: number): string {
  return `${sum.toLocaleString(intlLocale())} ${messages().units.money}`
}

export function formatDays(count: number): string {
  return messages().units.days(count)
}
