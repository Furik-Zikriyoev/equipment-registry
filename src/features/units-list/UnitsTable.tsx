import { useNavigate } from 'react-router-dom'
import { Group, Stack, Table, Text, UnstyledButton } from '@mantine/core'
import { IconArrowsSort, IconSortAscending, IconSortDescending } from '@tabler/icons-react'

import type { SortOrder, Unit, UnitSortField } from '../../types/unit'
import { UNIT_TYPE_LABELS } from '../../types/unit'
import { formatDate } from '../../shared/lib/date'
import { formatMileage } from '../../shared/lib/format'
import { ServiceDue } from '../../shared/ui/ServiceDue'
import { StatusBadge } from '../../shared/ui/StatusBadge'
import { UnitTypeIcon } from '../../shared/ui/UnitTypeIcon'

const NUMERIC_STYLE = { fontVariantNumeric: 'tabular-nums' } as const

interface SortableHeaderProps {
  field: UnitSortField
  label: string
  activeField: UnitSortField
  order: SortOrder
  onSortChange: (field: UnitSortField) => void
}

function SortableHeader({ field, label, activeField, order, onSortChange }: SortableHeaderProps) {
  const isActive = activeField === field
  const SortIcon = !isActive ? IconArrowsSort : order === 'asc' ? IconSortAscending : IconSortDescending

  return (
    <Table.Th ta="right">
      <UnstyledButton onClick={() => onSortChange(field)} aria-label={`Сортировать: ${label}`}>
        <Group gap={6} wrap="nowrap" justify="flex-end">
          <Text size="xs" fw={700} tt="uppercase" c={isActive ? undefined : 'dimmed'}>
            {label}
          </Text>
          <SortIcon
            size={15}
            stroke={2}
            color={isActive ? 'var(--mantine-primary-color-filled)' : 'var(--mantine-color-dimmed)'}
          />
        </Group>
      </UnstyledButton>
    </Table.Th>
  )
}

function HeaderCell({ children, w }: { children: string; w?: number }) {
  return (
    <Table.Th w={w}>
      <Text size="xs" fw={700} tt="uppercase" c="dimmed">
        {children}
      </Text>
    </Table.Th>
  )
}

interface UnitsTableProps {
  units: Unit[]
  sort: UnitSortField
  order: SortOrder
  onSortChange: (field: UnitSortField) => void
}

export function UnitsTable({ units, sort, order, onSortChange }: UnitsTableProps) {
  const navigate = useNavigate()

  return (
    <Table.ScrollContainer minWidth={760}>
      <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <HeaderCell>Техника</HeaderCell>
            <HeaderCell w={130}>Тип</HeaderCell>
            <HeaderCell w={140}>Статус</HeaderCell>
            <SortableHeader
              field="mileage"
              label="Пробег"
              activeField={sort}
              order={order}
              onSortChange={onSortChange}
            />
            <SortableHeader
              field="lastServiceDate"
              label="Последнее ТО"
              activeField={sort}
              order={order}
              onSortChange={onSortChange}
            />
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {units.map((unit) => (
            <Table.Tr
              key={unit.id}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/units/${unit.id}`)}
            >
              <Table.Td>
                <Group gap="sm" wrap="nowrap">
                  <UnitTypeIcon type={unit.type} />
                  <Stack gap={0}>
                    <Text ff="monospace" fw={600} size="sm" style={NUMERIC_STYLE}>
                      {unit.plateNumber}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {unit.model}
                    </Text>
                  </Stack>
                </Group>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{UNIT_TYPE_LABELS[unit.type]}</Text>
              </Table.Td>
              <Table.Td>
                <StatusBadge status={unit.status} />
              </Table.Td>
              <Table.Td ta="right" style={NUMERIC_STYLE}>
                <Text size="sm" fw={500}>
                  {formatMileage(unit.mileage)}
                </Text>
              </Table.Td>
              <Table.Td ta="right">
                <Stack gap={4} align="flex-end">
                  <Text size="sm" style={NUMERIC_STYLE}>
                    {formatDate(unit.lastServiceDate)}
                  </Text>
                  <ServiceDue lastServiceDate={unit.lastServiceDate} />
                </Stack>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
