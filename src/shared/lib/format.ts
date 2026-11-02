export function formatMileage(mileage: number): string {
  return `${mileage.toLocaleString('ru-RU')} км`
}

export function formatMoney(sum: number): string {
  return `${sum.toLocaleString('ru-RU')} сум`
}

/** Склонение: 1 день, 2 дня, 5 дней */
export function pluralize(count: number, forms: readonly [string, string, string]): string {
  const abs = Math.abs(count) % 100
  const last = abs % 10

  if (abs > 10 && abs < 20) return forms[2]
  if (last === 1) return forms[0]
  if (last >= 2 && last <= 4) return forms[1]

  return forms[2]
}

export function formatDays(count: number): string {
  return `${count} ${pluralize(count, ['день', 'дня', 'дней'])}`
}
