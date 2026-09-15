import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { SortOrder, UnitSortField, UnitStatus, UnitType, UnitsQuery } from '../types/unit'
import { UNIT_SORT_FIELDS, UNIT_STATUSES, UNIT_TYPES } from '../types/unit'
import { parseEnumValue } from '../shared/lib/parse'

interface ApplyOptions {
  replace?: boolean
  keepPage?: boolean
}

export interface UnitsSearchParamsResult {
  query: UnitsQuery
  hasActiveFilters: boolean
  setSearch: (value: string) => void
  setType: (value: UnitType | null) => void
  setStatus: (value: UnitStatus | null) => void
  toggleSort: (field: UnitSortField) => void
  setPage: (page: number) => void
  reset: () => void
}

function parsePage(value: string | null): number {
  const page = Number(value)

  return Number.isInteger(page) && page > 0 ? page : 1
}

export function useUnitsSearchParams(): UnitsSearchParamsResult {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = useMemo<UnitsQuery>(
    () => ({
      search: searchParams.get('search') ?? '',
      type: parseEnumValue(searchParams.get('type'), UNIT_TYPES),
      status: parseEnumValue(searchParams.get('status'), UNIT_STATUSES),
      sort: parseEnumValue(searchParams.get('sort'), UNIT_SORT_FIELDS) ?? 'mileage',
      order: searchParams.get('order') === 'desc' ? 'desc' : 'asc',
      page: parsePage(searchParams.get('page')),
    }),
    [searchParams],
  )

  const applyParams = useCallback(
    (mutate: (params: URLSearchParams) => void, options: ApplyOptions = {}) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          mutate(next)

          if (!options.keepPage) {
            next.delete('page')
          }

          return next
        },
        { replace: options.replace ?? false },
      )
    },
    [setSearchParams],
  )

  const setSearch = useCallback(
    (value: string) => {
      applyParams(
        (params) => {
          if (value) {
            params.set('search', value)
          } else {
            params.delete('search')
          }
        },
        { replace: true },
      )
    },
    [applyParams],
  )

  const setType = useCallback(
    (value: UnitType | null) => {
      applyParams((params) => {
        if (value) {
          params.set('type', value)
        } else {
          params.delete('type')
        }
      })
    },
    [applyParams],
  )

  const setStatus = useCallback(
    (value: UnitStatus | null) => {
      applyParams((params) => {
        if (value) {
          params.set('status', value)
        } else {
          params.delete('status')
        }
      })
    },
    [applyParams],
  )

  const toggleSort = useCallback(
    (field: UnitSortField) => {
      applyParams((params) => {
        const currentField = params.get('sort') ?? 'mileage'
        const currentOrder = params.get('order') === 'desc' ? 'desc' : 'asc'
        const nextOrder: SortOrder =
          currentField === field && currentOrder === 'asc' ? 'desc' : 'asc'

        params.set('sort', field)
        params.set('order', nextOrder)
      })
    },
    [applyParams],
  )

  const setPage = useCallback(
    (page: number) => {
      applyParams(
        (params) => {
          if (page > 1) {
            params.set('page', String(page))
          } else {
            params.delete('page')
          }
        },
        { keepPage: true },
      )
    },
    [applyParams],
  )

  const reset = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [setSearchParams])

  return {
    query,
    hasActiveFilters: Boolean(query.search || query.type || query.status),
    setSearch,
    setType,
    setStatus,
    toggleSort,
    setPage,
    reset,
  }
}
