export const UNIT_TYPES = ['dump_truck', 'excavator', 'loader'] as const
export type UnitType = (typeof UNIT_TYPES)[number]

export const UNIT_STATUSES = ['working', 'repair', 'idle'] as const
export type UnitStatus = (typeof UNIT_STATUSES)[number]

export const UNIT_SORT_FIELDS = ['mileage', 'lastServiceDate'] as const
export type UnitSortField = (typeof UNIT_SORT_FIELDS)[number]

export type SortOrder = 'asc' | 'desc'

export interface Unit {
  id: string
  plateNumber: string
  model: string
  type: UnitType
  status: UnitStatus
  mileage: number
  lastServiceDate: string
}

export type UnitDraft = Omit<Unit, 'id'>

export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  dump_truck: 'Самосвал',
  excavator: 'Экскаватор',
  loader: 'Погрузчик',
}

export const UNIT_STATUS_LABELS: Record<UnitStatus, string> = {
  working: 'Работает',
  repair: 'В ремонте',
  idle: 'Простой',
}

export interface UnitsQuery {
  search: string
  type: UnitType | null
  status: UnitStatus | null
  sort: UnitSortField
  order: SortOrder
  page: number
}

export interface UnitsPage {
  items: Unit[]
  total: number
}

export const SERVICE_KINDS = ['service', 'repair'] as const
export type ServiceKind = (typeof SERVICE_KINDS)[number]

export const SERVICE_KIND_LABELS: Record<ServiceKind, string> = {
  service: 'Плановое ТО',
  repair: 'Ремонт',
}

export interface ServiceRecord {
  id: string
  date: string
  kind: ServiceKind
  title: string
  mileage: number
  cost: number
}

export interface FleetStats {
  total: number
  totalMileage: number
  byStatus: Record<UnitStatus, number>
  byType: Record<UnitType, Record<UnitStatus, number>>
  serviceOverdue: number
  serviceSoon: number
  attention: Unit[]
}
