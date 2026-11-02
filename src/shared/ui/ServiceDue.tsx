import { Badge } from '@mantine/core'
import { IconAlertTriangle, IconClock } from '@tabler/icons-react'

import { formatDays } from '../lib/format'
import { daysUntil, getNextServiceDate, getServiceState } from '../lib/service'

interface ServiceDueProps {
  lastServiceDate: string
}

/** Плашка «ТО просрочено» / «ТО через N дней». Если до ТО далеко — ничего не показывает */
export function ServiceDue({ lastServiceDate }: ServiceDueProps) {
  const state = getServiceState(lastServiceDate)

  if (state === 'ok') {
    return null
  }

  const left = daysUntil(getNextServiceDate(lastServiceDate))
  const isOverdue = state === 'overdue'

  return (
    <Badge
      color={isOverdue ? 'red' : 'yellow'}
      variant="light"
      radius="sm"
      size="sm"
      tt="none"
      fw={600}
      leftSection={isOverdue ? <IconAlertTriangle size={12} /> : <IconClock size={12} />}
    >
      {isOverdue
        ? `ТО просрочено на ${formatDays(-left)}`
        : left === 0
          ? 'ТО сегодня'
          : `ТО через ${formatDays(left)}`}
    </Badge>
  )
}
