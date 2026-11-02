import type { ServiceRecord, Unit, UnitType } from '../types/unit'
import { addDays } from '../shared/lib/service'
import { createRandom, pick } from './data'

const SERVICE_TITLES = [
  'Замена масла и фильтров',
  'Проверка ходовой и тормозной системы',
  'Обслуживание гидравлики и замена жидкостей',
  'Диагностика двигателя, замена ремней',
] as const

const REPAIR_TITLES: Record<UnitType, readonly string[]> = {
  dump_truck: ['Замена тормозных колодок', 'Ремонт подъёмного механизма кузова', 'Замена рессоры'],
  excavator: ['Замена гидроцилиндра стрелы', 'Ремонт поворотного механизма', 'Замена зубьев ковша'],
  loader: ['Замена шин переднего моста', 'Ремонт гидравлики ковша', 'Замена стартера'],
}

/** История обслуживания: детерминирована по id, отсчитывается от даты последнего ТО */
export function createHistory(unit: Unit): ServiceRecord[] {
  const random = createRandom(Number(unit.id) * 7919 + 13)
  const records: ServiceRecord[] = []

  let date = unit.lastServiceDate
  let mileage = Math.max(0, unit.mileage - Math.floor(random() * 6000))
  const count = 3 + Math.floor(random() * 3)

  for (let i = 0; i < count && mileage > 0; i += 1) {
    records.push({
      id: `${unit.id}-s${i}`,
      date,
      kind: 'service',
      title: pick(SERVICE_TITLES, random),
      mileage,
      cost: 1_200_000 + Math.round(random() * 23) * 100_000,
    })

    const yearMileage = 25_000 + Math.floor(random() * 45_000)

    if (random() < 0.6) {
      const share = 0.2 + random() * 0.6
      records.push({
        id: `${unit.id}-r${i}`,
        date: addDays(date, -Math.round(365 * share)),
        kind: 'repair',
        title: pick(REPAIR_TITLES[unit.type], random),
        mileage: Math.max(0, mileage - Math.round(yearMileage * share)),
        cost: 2_000_000 + Math.round(random() * 130) * 100_000,
      })
    }

    date = addDays(date, -365)
    mileage -= yearMileage
  }

  return records.sort((left, right) => right.date.localeCompare(left.date))
}
