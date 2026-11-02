import { Group, Pagination, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

import { PAGE_SIZE } from '../../shared/config'
import classes from './UnitsPagination.module.css'

interface UnitsPaginationProps {
  page: number
  total: number
  onPageChange: (page: number) => void
}

export function UnitsPagination({ page, total, onPageChange }: UnitsPaginationProps) {
  const isMobile = useMediaQuery('(max-width: 36em)')

  if (total === 0) {
    return null
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const from = (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, total)

  return (
    <Group justify="space-between" align="center" mt="lg" gap="sm">
      <Text size="sm" c="dimmed" style={{ fontVariantNumeric: 'tabular-nums' }}>
        Показано {from}–{to} из {total}
      </Text>

      {totalPages > 1 && (
        <Pagination
          value={page}
          total={totalPages}
          onChange={onPageChange}
          size={isMobile ? 'sm' : 'md'}
          siblings={isMobile ? 0 : 1}
          radius="md"
          classNames={{ control: classes.control }}
        />
      )}
    </Group>
  )
}
