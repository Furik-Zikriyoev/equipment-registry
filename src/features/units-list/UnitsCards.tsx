import { Link } from 'react-router-dom'
import { Group, Paper, Stack, Text } from '@mantine/core'

import type { Unit } from '../../types/unit'
import { formatDate } from '../../shared/lib/date'
import { formatMileage } from '../../shared/lib/format'
import { ServiceDue } from '../../shared/ui/ServiceDue'
import { StatusBadge } from '../../shared/ui/StatusBadge'
import { UnitTypeIcon } from '../../shared/ui/UnitTypeIcon'
import { useT } from '../../i18n/useT'

const NUMERIC_STYLE = { fontVariantNumeric: 'tabular-nums' } as const

/** Список техники для телефона: вместо таблицы — карточки */
export function UnitsCards({ units }: { units: Unit[] }) {
  const t = useT()
  return (
    <Stack gap="sm">
      {units.map((unit) => (
        <Paper
          key={unit.id}
          component={Link}
          to={`/units/${unit.id}`}
          withBorder
          p="md"
          radius="lg"
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          <Stack gap="sm">
            <Group justify="space-between" wrap="nowrap" align="flex-start">
              <Group gap="sm" wrap="nowrap">
                <UnitTypeIcon type={unit.type} />
                <Stack gap={0}>
                  <Text ff="monospace" fw={600} size="sm">
                    {unit.plateNumber}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {unit.model}
                  </Text>
                </Stack>
              </Group>
              <StatusBadge status={unit.status} size="sm" />
            </Group>

            <Group justify="space-between" gap="xs">
              <Text size="sm" style={NUMERIC_STYLE}>
                {formatMileage(unit.mileage)}
              </Text>
              <Text size="sm" c="dimmed" style={NUMERIC_STYLE}>
                {t.service.short} {formatDate(unit.lastServiceDate)}
              </Text>
            </Group>

            <ServiceDue lastServiceDate={unit.lastServiceDate} />
          </Stack>
        </Paper>
      ))}
    </Stack>
  )
}
