import { Badge } from '@mantine/core'
import { IconAlertTriangle, IconClock } from '@tabler/icons-react'

import { formatDays } from '../lib/format'
import { daysUntil, getNextServiceDate, getServiceState } from '../lib/service'
import { useT } from '../../i18n/useT'

interface ServiceDueProps {
  lastServiceDate: string
}

/** Плашка «ТО просрочено» / «ТО через N дней». Если до ТО далеко — ничего не показывает */
export function ServiceDue({ lastServiceDate }: ServiceDueProps) {
  const t = useT()
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
        ? t.service.overdue(formatDays(-left))
        : left === 0
          ? t.service.today
          : t.service.soon(formatDays(left))}
    </Badge>
  )
}
