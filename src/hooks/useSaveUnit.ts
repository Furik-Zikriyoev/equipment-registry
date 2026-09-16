import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Unit, UnitDraft } from '../types/unit'
import { createUnit, updateUnit } from '../api/units'

export function useSaveUnit(id: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation<Unit, Error, UnitDraft>({
    mutationFn: (draft) => (id ? updateUnit(id, draft) : createUnit(draft)),
    onSuccess: (unit) => {
      queryClient.setQueryData(['unit', unit.id], unit)
      void queryClient.invalidateQueries({ queryKey: ['units'] })
    },
  })
}
