import { useQuery } from '@tanstack/react-query'

import type { UnitsPage, UnitsQuery } from '../types/unit'
import { getUnits } from '../api/units'

export function useUnits(query: UnitsQuery) {
  return useQuery<UnitsPage>({
    queryKey: ['units', query],
    queryFn: ({ signal }) => getUnits(query, signal),
  })
}
