import { useQuery } from '@tanstack/react-query'

import type { FleetStats } from '../types/unit'
import { getStats } from '../api/units'

export function useStats() {
  return useQuery<FleetStats>({
    queryKey: ['stats'],
    queryFn: ({ signal }) => getStats(signal),
  })
}
