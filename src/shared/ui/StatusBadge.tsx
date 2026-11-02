import { Badge, Box, type MantineSize } from '@mantine/core'

import type { UnitStatus } from '../../types/unit'
import { UNIT_STATUS_LABELS } from '../../types/unit'

export const STATUS_COLORS: Record<UnitStatus, string> = {
  working: 'teal',
  repair: 'orange',
  idle: 'gray',
}

interface StatusBadgeProps {
  status: UnitStatus
  size?: MantineSize
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const color = STATUS_COLORS[status]

  return (
    <Badge
      color={color}
      variant="light"
      radius="sm"
      size={size}
      tt="none"
      fw={600}
      leftSection={<Box w={6} h={6} bg={`${color}.6`} style={{ borderRadius: '50%' }} />}
    >
      {UNIT_STATUS_LABELS[status]}
    </Badge>
  )
}
