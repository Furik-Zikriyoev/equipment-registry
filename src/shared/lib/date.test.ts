import { describe, expect, it } from 'vitest'

import { formatDate, toLocalIsoDate } from './date'

describe('toLocalIsoDate', () => {
  it('использует локальный календарь, а не UTC', () => {
    const earlyMorning = new Date(2026, 0, 15, 2, 0, 0)

    expect(toLocalIsoDate(earlyMorning)).toBe('2026-01-15')
  })
})

describe('formatDate', () => {
  it('переводит ISO-дату в формат дд.мм.гггг', () => {
    expect(formatDate('2026-01-15')).toBe('15.01.2026')
  })

  it('возвращает исходную строку при неожиданном формате', () => {
    expect(formatDate('не дата')).toBe('не дата')
  })
})
