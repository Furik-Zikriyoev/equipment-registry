import { useEffect, useRef, useState } from 'react'
import { Button, Group, Select, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'

import type { UnitStatus, UnitType } from '../../types/unit'
import { UNIT_STATUSES, UNIT_TYPES } from '../../types/unit'
import { useT } from '../../i18n/useT'
import { SEARCH_DEBOUNCE_MS } from '../../shared/config'
import { parseEnumValue } from '../../shared/lib/parse'


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
  const t = useT()
  const typeOptions = UNIT_TYPES.map((value) => ({ value, label: t.unitType[value] }))
  const statusOptions = UNIT_STATUSES.map((value) => ({ value, label: t.unitStatus[value] }))
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
        label={t.list.search}
        placeholder={t.list.searchPlaceholder}
        value={inputValue}
        onChange={(event) => setInputValue(event.currentTarget.value)}
        leftSection={<IconSearch size={16} stroke={1.8} />}
        w={{ base: '100%', md: 300 }}
      />

      <Select
        label={t.list.type}
        placeholder={t.list.any}
        data={typeOptions}
        value={type}
        onChange={(value) => onTypeChange(parseEnumValue(value, UNIT_TYPES))}
        clearable
        w={{ base: 'calc(50% - var(--mantine-spacing-md) / 2)', md: 190 }}
      />

      <Select
        label={t.list.status}
        placeholder={t.list.any}
        data={statusOptions}
        value={status}
        onChange={(value) => onStatusChange(parseEnumValue(value, UNIT_STATUSES))}
        clearable
        w={{ base: 'calc(50% - var(--mantine-spacing-md) / 2)', md: 190 }}
      />

      <Button variant="subtle" color="gray" onClick={onReset} disabled={!hasActiveFilters}>
        {t.list.reset}
      </Button>
    </Group>
  )
}
