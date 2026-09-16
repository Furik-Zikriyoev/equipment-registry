import type { Unit, UnitStatus, UnitType } from '../types/unit'
import { UNIT_STATUSES, UNIT_TYPES } from '../types/unit'
import { toLocalIsoDate } from '../shared/lib/date'

const MODELS_BY_TYPE: Record<UnitType, readonly string[]> = {
  dump_truck: ['Камаз 6520', 'МАЗ 6501', 'Howo ZZ3257', 'Shacman SX3258', 'Volvo FMX 8x4'],
  excavator: ['Hitachi ZX200', 'Komatsu PC200', 'Caterpillar 320D', 'Hyundai R220LC', 'JCB JS220'],
  loader: ['Caterpillar 950M', 'Shantui SL50W', 'XCMG LW500FN', 'LiuGong CLG856', 'SDLG LG956L'],
}

const REGION_CODES = [
  '01',
  '10',
  '20',
  '30',
  '40',
  '50',
  '60',
  '70',
  '75',
  '80',
  '85',
  '90',
] as const

const LETTERS = 'ABCDEFHKLMNOPRSTUVXYZ'

const SEED_COUNT = 87

function createRandom(seed: number): () => number {
  let state = seed

  return () => {
    state = (state * 1664525 + 1013904223) % 4_294_967_296

    return state / 4_294_967_296
  }
}

function pick<T>(items: readonly T[], random: () => number): T {
  const item = items[Math.floor(random() * items.length)]

  if (item === undefined) {
    throw new Error('Невозможно выбрать элемент из пустого списка')
  }

  return item
}

function createPlateNumber(index: number, random: () => number): string {
  const region = pick(REGION_CODES, random)
  const firstLetter = pick([...LETTERS], random)
  const lastLetters = `${pick([...LETTERS], random)}${pick([...LETTERS], random)}`

  return `${region} ${firstLetter} ${100 + index} ${lastLetters}`
}

function createServiceDate(random: () => number): string {
  const daysAgo = 1 + Math.floor(random() * 720)
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)

  return toLocalIsoDate(date)
}

export function createSeedUnits(): Unit[] {
  const random = createRandom(20260915)

  return Array.from({ length: SEED_COUNT }, (_, index): Unit => {
    const type: UnitType = pick(UNIT_TYPES, random)
    const status: UnitStatus = pick(UNIT_STATUSES, random)

    return {
      id: String(index + 1),
      plateNumber: createPlateNumber(index, random),
      model: pick(MODELS_BY_TYPE[type], random),
      type,
      status,
      mileage: Math.floor(random() * 450_000),
      lastServiceDate: createServiceDate(random),
    }
  })
}
