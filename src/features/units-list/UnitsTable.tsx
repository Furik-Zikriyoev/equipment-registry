import { useNavigate } from 'react-router-dom'
import { Badge, Group, Table, Text, UnstyledButton } from '@mantine/core'

import type { SortOrder, Unit, UnitSortField, UnitStatus } from '../../types/unit'
import { UNIT_STATUS_LABELS, UNIT_TYPE_LABELS } from '../../types/unit'
import { formatDate } from '../../shared/lib/date'
import { formatMileage } from '../../shared/lib/format'

const STATUS_COLORS: Record<UnitStatus, string> = {
  working: 'green',
  repair: 'orange',
  idle: 'gray',
}

const NUMERIC_STYLE = { fontVariantNumeric: 'tabular-nums' } as const

interface SortableHeaderProps {
  field: UnitSortField
  label: string
  activeField: UnitSortField
  order: SortOrder
  align: 'left' | 'right'
  onSortChange: (field: UnitSortField) => void
}

function SortableHeader({
  field,
  label,
  activeField,
  order,
  align,
  onSortChange,
}: SortableHeaderProps) {
  const isActive = activeField === field
  const indicator = isActive ? (order === 'asc' ? '↑' : '↓') : '↕'

  return (
    <Table.Th ta={align}>
      <UnstyledButton w="100%" onClick={() => onSortChange(field)}>
        <Group gap={6} wrap="nowrap" justify={align === 'right' ? 'flex-end' : 'flex-start'}>
          <Text size="sm" fw={600}>
            {label}
          </Text>
          <Text size="sm" c={isActive ? 'blue.6' : 'gray.5'}>
            {indicator}
          </Text>
        </Group>
      </UnstyledButton>
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
    <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="md" layout="fixed">
      <Table.Thead>
        <Table.Tr>
          <Table.Th w={150}>Гос. номер</Table.Th>
          <Table.Th>Модель</Table.Th>
          <Table.Th w={130}>Тип</Table.Th>
          <Table.Th w={130} ta="center">
            Статус
          </Table.Th>

          <SortableHeader
            field="mileage"
            label="Пробег"
            activeField={sort}
            order={order}
            align="right"
            onSortChange={onSortChange}
          />

          <SortableHeader
            field="lastServiceDate"
            label="Дата ТО"
            activeField={sort}
            order={order}
            align="right"
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
            <Table.Td fw={600} style={NUMERIC_STYLE}>
              {unit.plateNumber}
            </Table.Td>
            <Table.Td>{unit.model}</Table.Td>
            <Table.Td c="dimmed">{UNIT_TYPE_LABELS[unit.type]}</Table.Td>
            <Table.Td ta="center">
              <Badge color={STATUS_COLORS[unit.status]} variant="light" radius="sm">
                {UNIT_STATUS_LABELS[unit.status]}
              </Badge>
            </Table.Td>
            <Table.Td ta="right" style={NUMERIC_STYLE}>
              {formatMileage(unit.mileage)}
            </Table.Td>
            <Table.Td ta="right" c="dimmed" style={NUMERIC_STYLE}>
              {formatDate(unit.lastServiceDate)}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}
