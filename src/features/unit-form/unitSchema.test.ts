import { describe, expect, it } from 'vitest'

import { toLocalIsoDate } from '../../shared/lib/date'
import { unitSchema } from './unitSchema'

const VALID_UNIT = {
  plateNumber: '01 A 123 AA',
  model: 'КамАЗ 6520',
  type: 'dump_truck',
  status: 'working',
  mileage: '124500',
  lastServiceDate: '2026-01-15',
}

function validate(overrides: Record<string, unknown>) {
  return unitSchema.safeParse({ ...VALID_UNIT, ...overrides })
}

function shiftDays(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)

  return toLocalIsoDate(date)
}

describe('unitSchema — пробег', () => {
  it('принимает ноль', () => {
    expect(validate({ mileage: '0' }).success).toBe(true)
  })

  it('отклоняет отрицательное значение', () => {
    expect(validate({ mileage: '-1' }).success).toBe(false)
  })

  it('отклоняет дробное значение', () => {
    expect(validate({ mileage: '1.5' }).success).toBe(false)
  })

  it('отклоняет запись в экспоненциальной форме', () => {
    expect(validate({ mileage: '1e5' }).success).toBe(false)
  })

  it('отклоняет пустую строку', () => {
    expect(validate({ mileage: '' }).success).toBe(false)
  })
})

describe('unitSchema — дата последнего ТО', () => {
  it('принимает сегодняшнюю дату', () => {
    expect(validate({ lastServiceDate: shiftDays(0) }).success).toBe(true)
  })

  it('принимает вчерашнюю дату', () => {
    expect(validate({ lastServiceDate: shiftDays(-1) }).success).toBe(true)
  })

  it('отклоняет завтрашнюю дату', () => {
    expect(validate({ lastServiceDate: shiftDays(1) }).success).toBe(false)
  })
})

describe('unitSchema — обязательные поля', () => {
  it('отклоняет гос. номер из одних пробелов', () => {
    expect(validate({ plateNumber: '   ' }).success).toBe(false)
  })

  it('отклоняет неизвестный тип техники', () => {
    expect(validate({ type: 'helicopter' }).success).toBe(false)
  })
})
