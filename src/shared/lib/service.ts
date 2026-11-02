import { SERVICE_INTERVAL_DAYS, SERVICE_SOON_DAYS } from '../config'
import { toLocalIsoDate } from './date'

export type ServiceState = 'ok' | 'soon' | 'overdue'

const DAY_MS = 86_400_000

function parseIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number)

  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1)
}

export function addDays(isoDate: string, days: number): string {
  const date = parseIsoDate(isoDate)
  date.setDate(date.getDate() + days)

  return toLocalIsoDate(date)
}

export function daysUntil(isoDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Math.round((parseIsoDate(isoDate).getTime() - today.getTime()) / DAY_MS)
}

export function getNextServiceDate(lastServiceDate: string): string {
  return addDays(lastServiceDate, SERVICE_INTERVAL_DAYS)
}

export function getServiceState(lastServiceDate: string): ServiceState {
  const left = daysUntil(getNextServiceDate(lastServiceDate))

  if (left < 0) return 'overdue'
  if (left <= SERVICE_SOON_DAYS) return 'soon'

  return 'ok'
}
