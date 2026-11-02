import { z } from 'zod'

import { UNIT_STATUSES, UNIT_TYPES } from '../../types/unit'
import { toLocalIsoDate } from '../../shared/lib/date'

// Сообщения — ключи из messages.form.errors, текст подставляет форма.
const MILEAGE_PATTERN = /^\d+$/

export const unitSchema = z.object({
  plateNumber: z.string().trim().min(1, 'plateRequired'),
  model: z.string().trim().min(1, 'modelRequired'),
  type: z.enum(UNIT_TYPES),
  status: z.enum(UNIT_STATUSES),
  mileage: z
    .string()
    .trim()
    .min(1, 'mileageRequired')
    .refine((value) => MILEAGE_PATTERN.test(value), 'mileageInvalid'),
  lastServiceDate: z
    .string()
    .min(1, 'dateRequired')
    .refine((value) => value <= toLocalIsoDate(new Date()), 'dateFuture'),
})

export type UnitFormValues = z.infer<typeof unitSchema>
