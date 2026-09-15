import type { Unit, UnitDraft, UnitsPage, UnitsQuery } from '../types/unit'
import { apiRequest } from './client'

function buildUnitsSearchParams(query: UnitsQuery): string {
  const params = new URLSearchParams()

  if (query.search) {
    params.set('search', query.search)
  }

  if (query.type) {
    params.set('type', query.type)
  }

  if (query.status) {
    params.set('status', query.status)
  }

  params.set('sort', query.sort)
  params.set('order', query.order)
  params.set('page', String(query.page))

  return params.toString()
}

export function getUnits(query: UnitsQuery, signal?: AbortSignal): Promise<UnitsPage> {
  return apiRequest<UnitsPage>(`/units?${buildUnitsSearchParams(query)}`, { signal })
}

export function getUnit(id: string, signal?: AbortSignal): Promise<Unit> {
  return apiRequest<Unit>(`/units/${id}`, { signal })
}

export function createUnit(draft: UnitDraft): Promise<Unit> {
  return apiRequest<Unit>('/units', {
    method: 'POST',
    body: JSON.stringify(draft),
  })
}

export function updateUnit(id: string, draft: UnitDraft): Promise<Unit> {
  return apiRequest<Unit>(`/units/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(draft),
  })
}

export function checkPlateNumber(
  plateNumber: string,
  excludeId?: string,
  signal?: AbortSignal,
): Promise<{ available: boolean }> {
  const params = new URLSearchParams({ plateNumber })

  if (excludeId) {
    params.set('excludeId', excludeId)
  }

  return apiRequest<{ available: boolean }>(`/units/check-plate?${params.toString()}`, { signal })
}
