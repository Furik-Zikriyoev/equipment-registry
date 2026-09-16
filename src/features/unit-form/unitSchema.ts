import { z } from 'zod'

import { UNIT_STATUSES, UNIT_TYPES } from '../../types/unit'
import { toLocalIsoDate } from '../../shared/lib/date'

const MILEAGE_PATTERN = /^\d+$/

export const unitSchema = z.object({
  plateNumber: z.string().trim().min(1, 'Укажите гос. номер'),
  model: z.string().trim().min(1, 'Укажите модель'),
  type: z.enum(UNIT_TYPES),
  status: z.enum(UNIT_STATUSES),
  mileage: z
    .string()
    .trim()
    .min(1, 'Укажите пробег')
    .refine((value) => MILEAGE_PATTERN.test(value), 'Пробег — целое число не меньше нуля'),
  lastServiceDate: z
    .string()
    .min(1, 'Укажите дату последнего ТО')
    .refine((value) => value <= toLocalIsoDate(new Date()), 'Дата ТО не может быть в будущем'),
})

export type UnitFormValues = z.infer<typeof unitSchema>
