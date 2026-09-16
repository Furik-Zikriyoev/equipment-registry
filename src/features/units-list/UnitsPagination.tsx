import { Box, Group, Pagination, Text } from '@mantine/core'

import { PAGE_SIZE } from '../../shared/config'
import classes from './UnitsPagination.module.css'

interface UnitsPaginationProps {
  page: number
  total: number
  onPageChange: (page: number) => void
}

export function UnitsPagination({ page, total, onPageChange }: UnitsPaginationProps) {
  if (total === 0) {
    return null
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const from = (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, total)

  return (
    <Group justify="space-between" align="center" wrap="nowrap" mt="lg">
      <Box w={200} />

      {totalPages > 1 ? (
        <Pagination
          value={page}
          total={totalPages}
          onChange={onPageChange}
          radius="md"
          classNames={{ control: classes.control }}
        />
      ) : (
        <Box />
      )}

      <Text w={200} ta="right" size="sm" c="dimmed">
        Показано {from}–{to} из {total}
      </Text>
    </Group>
  )
}
