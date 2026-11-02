import { ThemeIcon, Tooltip } from '@mantine/core'
import type { Icon } from '@tabler/icons-react'
import { IconBackhoe, IconBulldozer, IconTruck } from '@tabler/icons-react'

import type { UnitType } from '../../types/unit'
import { UNIT_TYPE_LABELS } from '../../types/unit'

export const UNIT_TYPE_ICONS: Record<UnitType, Icon> = {
  dump_truck: IconTruck,
  excavator: IconBackhoe,
  loader: IconBulldozer,
}

interface UnitTypeIconProps {
  type: UnitType
  size?: number
}

export function UnitTypeIcon({ type, size = 38 }: UnitTypeIconProps) {
  const TypeIcon = UNIT_TYPE_ICONS[type]

  return (
    <Tooltip label={UNIT_TYPE_LABELS[type]} withArrow openDelay={300}>
      <ThemeIcon variant="light" color="brand" size={size} radius="md">
        <TypeIcon size={Math.round(size * 0.55)} stroke={1.6} />
      </ThemeIcon>
    </Tooltip>
  )
}
