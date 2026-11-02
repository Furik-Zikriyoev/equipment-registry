import type { Lang } from '../i18n/lang'
import type { ServiceRecord, Unit, UnitType } from '../types/unit'
import { addDays } from '../shared/lib/service'
import { createRandom, pick } from './data'

const SERVICE_TITLES: Record<Lang, readonly string[]> = {
  ru: [
    'Замена масла и фильтров',
    'Проверка ходовой и тормозной системы',
    'Обслуживание гидравлики и замена жидкостей',
    'Диагностика двигателя, замена ремней',
  ],
  en: [
    'Oil and filter change',
    'Chassis and brake system check',
    'Hydraulics service and fluid change',
    'Engine diagnostics, belt replacement',
  ],
}

const REPAIR_TITLES: Record<Lang, Record<UnitType, readonly string[]>> = {
  ru: {
    dump_truck: ['Замена тормозных колодок', 'Ремонт подъёмного механизма кузова', 'Замена рессоры'],
    excavator: ['Замена гидроцилиндра стрелы', 'Ремонт поворотного механизма', 'Замена зубьев ковша'],
    loader: ['Замена шин переднего моста', 'Ремонт гидравлики ковша', 'Замена стартера'],
  },
  en: {
    dump_truck: ['Brake pad replacement', 'Body lift mechanism repair', 'Leaf spring replacement'],
    excavator: ['Boom cylinder replacement', 'Swing mechanism repair', 'Bucket teeth replacement'],
    loader: ['Front axle tyre replacement', 'Bucket hydraulics repair', 'Starter replacement'],
  },
}

/** История обслуживания: детерминирована по id, отсчитывается от даты последнего ТО */
export function createHistory(unit: Unit, lang: Lang = 'ru'): ServiceRecord[] {
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
      title: pick(SERVICE_TITLES[lang], random),
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
        title: pick(REPAIR_TITLES[lang][unit.type], random),
        mileage: Math.max(0, mileage - Math.round(yearMileage * share)),
        cost: 2_000_000 + Math.round(random() * 130) * 100_000,
      })
    }

    date = addDays(date, -365)
    mileage -= yearMileage
  }

  return records.sort((left, right) => right.date.localeCompare(left.date))
}
