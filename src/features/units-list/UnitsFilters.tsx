import { useEffect, useRef, useState } from 'react'
import { Button, Group, Select, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'

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
        leftSection={<IconSearch size={16} stroke={1.8} />}
        w={{ base: '100%', md: 300 }}
      />

      <Select
        label="Тип"
        placeholder="Все"
        data={TYPE_OPTIONS}
        value={type}
        onChange={(value) => onTypeChange(parseEnumValue(value, UNIT_TYPES))}
        clearable
        w={{ base: 'calc(50% - var(--mantine-spacing-md) / 2)', md: 190 }}
      />

      <Select
        label="Статус"
        placeholder="Все"
        data={STATUS_OPTIONS}
        value={status}
        onChange={(value) => onStatusChange(parseEnumValue(value, UNIT_STATUSES))}
        clearable
        w={{ base: 'calc(50% - var(--mantine-spacing-md) / 2)', md: 190 }}
      />

      <Button variant="subtle" color="gray" onClick={onReset} disabled={!hasActiveFilters}>
        Сбросить
      </Button>
    </Group>
  )
}
