import type { Unit, UnitDraft } from '../types/unit'
import { createSeedUnits } from './data'

let units: Unit[] = createSeedUnits()
let nextId = units.length + 1

export const db = {
  getAll(): Unit[] {
    return units
  },

  getById(id: string): Unit | undefined {
    return units.find((unit) => unit.id === id)
  },

  findByPlateNumber(plateNumber: string): Unit | undefined {
    const normalized = plateNumber.trim().toLowerCase()

    return units.find((unit) => unit.plateNumber.toLowerCase() === normalized)
  },

  create(draft: UnitDraft): Unit {
    const unit: Unit = { id: String(nextId), ...draft }
    nextId += 1
    units = [unit, ...units]

    return unit
  },

  update(id: string, draft: UnitDraft): Unit | undefined {
    const exists = units.some((unit) => unit.id === id)

    if (!exists) {
      return undefined
    }

    const updated: Unit = { ...draft, id }
    units = units.map((unit) => (unit.id === id ? updated : unit))

    return updated
  },
}
