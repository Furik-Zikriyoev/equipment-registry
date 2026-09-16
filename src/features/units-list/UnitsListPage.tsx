import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Button, Group, LoadingOverlay, Paper, Text, Title } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

import { useUnits } from '../../hooks/useUnits'
import { useUnitsSearchParams } from '../../hooks/useUnitsSearchParams'
import { EmptyState } from '../../shared/ui/EmptyState'
import { ErrorState } from '../../shared/ui/ErrorState'
import { UnitsFilters } from './UnitsFilters'
import { UnitsPagination } from './UnitsPagination'
import { UnitsTable } from './UnitsTable'
import { UnitsTableSkeleton } from './UnitsTableSkeleton'

export function UnitsListPage() {
  const navigate = useNavigate()

  const { query, hasActiveFilters, setSearch, setType, setStatus, toggleSort, setPage, reset } =
    useUnitsSearchParams()

  const { data, isPending, isError, error, isFetching, refetch } = useUnits(query)

  function renderContent(): ReactNode {
    if (isPending) {
      return <UnitsTableSkeleton />
    }

    if (isError) {
      return (
        <ErrorState
          message={error.message}
          onRetry={() => {
            void refetch()
          }}
        />
      )
    }

    if (!data) {
      return null
    }

    if (data.total === 0) {
      return hasActiveFilters ? (
        <EmptyState
          title="Ничего не найдено"
          description="По заданным условиям техника не найдена. Попробуйте изменить или сбросить фильтры."
          actionLabel="Сбросить фильтры"
          onAction={reset}
        />
      ) : (
        <EmptyState
          title="Техника ещё не добавлена"
          description="В реестре пока нет ни одной единицы техники."
          actionLabel="Добавить технику"
          onAction={() => navigate('/units/new')}
        />
      )
    }

    if (data.items.length === 0) {
      return (
        <EmptyState
          title="На этой странице пусто"
          description={`Всего записей: ${data.total}. Похоже, страница за пределами диапазона.`}
          actionLabel="На первую страницу"
          onAction={() => setPage(1)}
        />
      )
    }

    return (
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
    )
  }

  return (
    <>
      <Group justify="space-between" mb="lg">
        <Group gap="sm" align="baseline">
          <Title order={2}>Список техники</Title>
          {data && (
            <Text c="dimmed" size="xl" fw={500}>
              {data.total}
            </Text>
          )}
        </Group>

        <Button
          component={Link}
          to="/units/new"
          color="green"
          leftSection={<IconPlus size={18} stroke={2.2} />}
        >
          Добавить технику
        </Button>
      </Group>

      <Paper withBorder radius="md" p="md" mb="md">
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
      </Paper>

      <Paper withBorder radius="md" p="md">
        {renderContent()}
      </Paper>
    </>
  )
}
