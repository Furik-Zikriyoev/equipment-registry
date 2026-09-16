import { useEffect, useRef, useState } from 'react'
import { Button, Group, Select, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'

import type { UnitStatus, UnitType } from '../../types/unit'
import { UNIT_STATUSES, UNIT_STATUS_LABELS, UNIT_TYPES, UNIT_TYPE_LABELS } from '../../types/unit'
import { SEARCH_DEBOUNCE_MS } from '../../shared/config'
import { parseEnumValue } from '../../shared/lib/parse'

const TYPE_OPTIONS = UNIT_TYPES.map((type) => ({ value: type, label: UNIT_TYPE_LABELS[type] }))

const STATUS_OPTIONS = UNIT_STATUSES.map((status) => ({
  value: status,
  label: UNIT_STATUS_LABELS[status],
}))

interface UnitsFiltersProps {
  search: string
  type: UnitType | null
  status: UnitStatus | null
  hasActiveFilters: boolean
  onSearchChange: (value: string) => void
  onTypeChange: (value: UnitType | null) => void
  onStatusChange: (value: UnitStatus | null) => void
  onReset: () => void
}

export function UnitsFilters({
  search,
  type,
  status,
  hasActiveFilters,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onReset,
}: UnitsFiltersProps) {
  const [inputValue, setInputValue] = useState(search)
  const [debouncedValue] = useDebouncedValue(inputValue, SEARCH_DEBOUNCE_MS)
  const syncedValueRef = useRef(search)

  useEffect(() => {
    if (search !== syncedValueRef.current) {
      syncedValueRef.current = search
      setInputValue(search)
    }
  }, [search])

  useEffect(() => {
    if (debouncedValue !== syncedValueRef.current) {
      syncedValueRef.current = debouncedValue
      onSearchChange(debouncedValue)
    }
  }, [debouncedValue, onSearchChange])

  return (
    <Group align="flex-end">
      <TextInput
        label="Поиск"
        placeholder="Гос. номер или модель"
        value={inputValue}
        onChange={(event) => setInputValue(event.currentTarget.value)}
        w={280}
      />

      <Select
        label="Тип"
        placeholder="Все"
        data={TYPE_OPTIONS}
        value={type}
        onChange={(value) => onTypeChange(parseEnumValue(value, UNIT_TYPES))}
        clearable
        w={190}
      />

      <Select
        label="Статус"
        placeholder="Все"
        data={STATUS_OPTIONS}
        value={status}
        onChange={(value) => onStatusChange(parseEnumValue(value, UNIT_STATUSES))}
        clearable
        w={190}
      />

      <Button variant="subtle" onClick={onReset} disabled={!hasActiveFilters}>
        Сбросить
      </Button>
    </Group>
  )
}
