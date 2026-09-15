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

interface SortableHeaderProps {
  field: UnitSortField
  label: string
  activeField: UnitSortField
  order: SortOrder
  onSortChange: (field: UnitSortField) => void
}

function SortableHeader({ field, label, activeField, order, onSortChange }: SortableHeaderProps) {
  const isActive = activeField === field
  const indicator = isActive ? (order === 'asc' ? '↑' : '↓') : '↕'

  return (
    <Table.Th>
      <UnstyledButton onClick={() => onSortChange(field)}>
        <Group gap={6} wrap="nowrap">
          <Text size="sm" fw={700}>
            {label}
          </Text>
          <Text size="sm" c={isActive ? 'blue' : 'dimmed'}>
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
    <Table highlightOnHover verticalSpacing="sm">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Гос. номер</Table.Th>
          <Table.Th>Модель</Table.Th>
          <Table.Th>Тип</Table.Th>
          <Table.Th>Статус</Table.Th>

          <SortableHeader
            field="mileage"
            label="Пробег"
            activeField={sort}
            order={order}
            onSortChange={onSortChange}
          />

          <SortableHeader
            field="lastServiceDate"
            label="Дата последнего ТО"
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
            <Table.Td>{unit.plateNumber}</Table.Td>
            <Table.Td>{unit.model}</Table.Td>
            <Table.Td>{UNIT_TYPE_LABELS[unit.type]}</Table.Td>
            <Table.Td>
              <Badge color={STATUS_COLORS[unit.status]} variant="light">
                {UNIT_STATUS_LABELS[unit.status]}
              </Badge>
            </Table.Td>
            <Table.Td>{formatMileage(unit.mileage)}</Table.Td>
            <Table.Td>{formatDate(unit.lastServiceDate)}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}
