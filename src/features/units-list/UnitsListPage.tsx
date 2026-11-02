import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Button, LoadingOverlay, Paper } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'

import { useUnits } from '../../hooks/useUnits'
import { useUnitsSearchParams } from '../../hooks/useUnitsSearchParams'
import { EmptyState } from '../../shared/ui/EmptyState'
import { ErrorState } from '../../shared/ui/ErrorState'
import { PageHeader } from '../../shared/ui/PageHeader'
import { usePageTitle } from '../../shared/lib/usePageTitle'
import { useT } from '../../i18n/useT'
import { UnitsCards } from './UnitsCards'
import { UnitsFilters } from './UnitsFilters'
import { UnitsPagination } from './UnitsPagination'
import { UnitsTable } from './UnitsTable'
import { UnitsTableSkeleton } from './UnitsTableSkeleton'

export function UnitsListPage() {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 62em)')
  const t = useT()
  usePageTitle(t.list.title)

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
          title={t.list.notFoundTitle}
          description={t.list.notFoundText}
          actionLabel={t.list.resetFilters}
          onAction={reset}
        />
      ) : (
        <EmptyState
          title={t.list.emptyTitle}
          description={t.list.emptyText}
          actionLabel={t.list.add}
          onAction={() => navigate('/units/new')}
        />
      )
    }

    if (data.items.length === 0) {
      return (
        <EmptyState
          title={t.list.pageEmptyTitle}
          description={t.list.pageEmptyText(data.total)}
          actionLabel={t.list.firstPage}
          onAction={() => setPage(1)}
        />
      )
    }

    return (
      <Box pos="relative">
        <LoadingOverlay visible={isFetching} zIndex={1} overlayProps={{ blur: 1 }} />

        {isMobile ? (
          <UnitsCards units={data.items} />
        ) : (
          <UnitsTable
            units={data.items}
            sort={query.sort}
            order={query.order}
            onSortChange={toggleSort}
          />
        )}

        <UnitsPagination page={query.page} total={data.total} onPageChange={setPage} />
      </Box>
    )
  }

  return (
    <>
      <PageHeader
        title={t.list.title}
        description={
          data
            ? hasActiveFilters
              ? t.list.filtered(t.units.count(data.total))
              : t.list.inFleet(t.units.count(data.total))
            : t.list.subtitle
        }
        actions={
          <Button
            component={Link}
            to="/units/new"
            size="md"
            leftSection={<IconPlus size={18} stroke={2.2} />}
          >
            {t.list.add}
          </Button>
        }
      />

      <Paper withBorder radius="lg" p="md" mb="md">
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

      <Paper withBorder={!isMobile} bg={isMobile ? 'transparent' : undefined} radius="lg" p={isMobile ? 0 : 'md'}>
        {renderContent()}
      </Paper>
    </>
  )
}
