import { useNavigate } from 'react-router-dom'
import { Badge, Table } from '@mantine/core'

import type { Unit, UnitStatus } from '../../types/unit'
import { UNIT_STATUS_LABELS, UNIT_TYPE_LABELS } from '../../types/unit'
import { formatDate } from '../../shared/lib/date'
import { formatMileage } from '../../shared/lib/format'

const STATUS_COLORS: Record<UnitStatus, string> = {
  working: 'green',
  repair: 'orange',
  idle: 'gray',
}

interface UnitsTableProps {
  units: Unit[]
}

export function UnitsTable({ units }: UnitsTableProps) {
  const navigate = useNavigate()

  return (
    <Table highlightOnHover verticalSpacing="sm">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Гос. номер</Table.Th>
          <Table.Th>Модель</Table.Th>
          <Table.Th>Тип</Table.Th>
          <Table.Th>Статус</Table.Th>
          <Table.Th>Пробег</Table.Th>
          <Table.Th>Дата последнего ТО</Table.Th>
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
