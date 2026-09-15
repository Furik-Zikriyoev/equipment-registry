import { Link } from 'react-router-dom'
import { Box, Button, Group, Loader, LoadingOverlay, Text, Title } from '@mantine/core'

import { useUnits } from '../../hooks/useUnits'
import { useUnitsSearchParams } from '../../hooks/useUnitsSearchParams'
import { UnitsFilters } from './UnitsFilters'
import { UnitsPagination } from './UnitsPagination'
import { UnitsTable } from './UnitsTable'

export function UnitsListPage() {
  const { query, hasActiveFilters, setSearch, setType, setStatus, toggleSort, setPage, reset } =
    useUnitsSearchParams()

  const { data, isPending, isError, error, isFetching } = useUnits(query)

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

      {data && (
        <Box pos="relative">
          <LoadingOverlay visible={isFetching} zIndex={1} overlayProps={{ blur: 1 }} />

          <UnitsTable
            units={data.items}
            sort={query.sort}
            order={query.order}
            onSortChange={toggleSort}
          />

          <UnitsPagination page={query.page} total={data.total} onPageChange={setPage} />
        </Box>
      )}
    </>
  )
}
