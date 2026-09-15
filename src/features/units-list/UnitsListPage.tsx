import { Link } from 'react-router-dom'
import { Button, Group, Loader, Text, Title } from '@mantine/core'

import { useUnits } from '../../hooks/useUnits'
import { useUnitsSearchParams } from '../../hooks/useUnitsSearchParams'
import { UnitsFilters } from './UnitsFilters'
import { UnitsTable } from './UnitsTable'

export function UnitsListPage() {
  const { query, hasActiveFilters, setSearch, setType, setStatus, reset } = useUnitsSearchParams()
  const { data, isPending, isError, error } = useUnits(query)

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={2}>Список техники</Title>
        <Button component={Link} to="/units/new">
          Добавить технику
        </Button>
      </Group>

      <UnitsFilters
        search={query.search}
        type={query.type}
        status={query.status}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onTypeChange={setType}
        onStatusChange={setStatus}
        onReset={reset}
      />

      {isPending && <Loader />}
      {isError && <Text c="red">{error.message}</Text>}
      {data && <UnitsTable units={data.items} />}
    </>
  )
}
