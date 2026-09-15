import { Link } from 'react-router-dom'
import { Button, Group, Loader, Text, Title } from '@mantine/core'

import type { UnitsQuery } from '../../types/unit'
import { useUnits } from '../../hooks/useUnits'
import { UnitsTable } from './UnitsTable'

const TEMPORARY_QUERY: UnitsQuery = {
  search: '',
  type: null,
  status: null,
  sort: 'mileage',
  order: 'asc',
  page: 1,
}

export function UnitsListPage() {
  const { data, isPending, isError, error } = useUnits(TEMPORARY_QUERY)

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={2}>Список техники</Title>
        <Button component={Link} to="/units/new">
          Добавить технику
        </Button>
      </Group>

      {isPending && <Loader />}
      {isError && <Text c="red">{error.message}</Text>}
      {data && <UnitsTable units={data.items} />}
    </>
  )
}
