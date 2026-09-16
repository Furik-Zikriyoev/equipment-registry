import { useQuery } from '@tanstack/react-query'

import type { Unit } from '../types/unit'
import { getUnit } from '../api/units'

export function useUnit(id: string | undefined) {
  return useQuery<Unit>({
    queryKey: ['unit', id],
    queryFn: ({ signal }) => getUnit(id ?? '', signal),
    enabled: Boolean(id),
  })
}
