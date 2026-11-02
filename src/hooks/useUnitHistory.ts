import { useQuery } from '@tanstack/react-query'

import type { ServiceRecord } from '../types/unit'
import { getUnitHistory } from '../api/units'

export function useUnitHistory(id: string | undefined) {
  return useQuery<ServiceRecord[]>({
    queryKey: ['unit-history', id],
    queryFn: ({ signal }) => getUnitHistory(id ?? '', signal),
    enabled: Boolean(id),
  })
}
