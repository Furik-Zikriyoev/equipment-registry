import { describe, expect, it } from 'vitest'

import { UNIT_TYPES } from '../../types/unit'
import { parseEnumValue } from './parse'

describe('parseEnumValue', () => {
  it('возвращает значение, если оно есть в списке', () => {
    expect(parseEnumValue('excavator', UNIT_TYPES)).toBe('excavator')
  })

  it('возвращает null для значения не из списка', () => {
    expect(parseEnumValue('helicopter', UNIT_TYPES)).toBeNull()
  })

  it('возвращает null для null', () => {
    expect(parseEnumValue(null, UNIT_TYPES)).toBeNull()
  })

  it('возвращает null для пустой строки', () => {
    expect(parseEnumValue('', UNIT_TYPES)).toBeNull()
  })
})
