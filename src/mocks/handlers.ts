import { delay, http, HttpResponse } from 'msw'

import type { Unit, UnitDraft } from '../types/unit'
import { API_DELAY_MS, PAGE_SIZE } from '../shared/config'
import { db } from './db'

function sortUnits(units: Unit[], sort: string, order: string): Unit[] {
  const direction = order === 'desc' ? -1 : 1

  return [...units].sort((left, right) => {
    if (sort === 'lastServiceDate') {
      return left.lastServiceDate.localeCompare(right.lastServiceDate) * direction
    }

    return (left.mileage - right.mileage) * direction
  })
}

export const handlers = [
  http.get('/api/units/check-plate', async ({ request }) => {
    await delay(API_DELAY_MS)

    const url = new URL(request.url)
    const plateNumber = url.searchParams.get('plateNumber') ?? ''
    const excludeId = url.searchParams.get('excludeId')

    const existing = db.findByPlateNumber(plateNumber)
    const available = existing === undefined || existing.id === excludeId

    return HttpResponse.json({ available })
  }),

  http.get('/api/units', async ({ request }) => {
    await delay(API_DELAY_MS)

    const url = new URL(request.url)
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase()
    const type = url.searchParams.get('type')
    const status = url.searchParams.get('status')
    const sort = url.searchParams.get('sort') ?? 'mileage'
    const order = url.searchParams.get('order') ?? 'asc'
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1)

    let result = db.getAll()

    if (type) {
      result = result.filter((unit) => unit.type === type)
    }

    if (status) {
      result = result.filter((unit) => unit.status === status)
    }

    if (search) {
      result = result.filter(
        (unit) =>
          unit.plateNumber.toLowerCase().includes(search) ||
          unit.model.toLowerCase().includes(search),
      )
    }

    result = sortUnits(result, sort, order)

    const total = result.length
    const start = (page - 1) * PAGE_SIZE
    const items = result.slice(start, start + PAGE_SIZE)

    return HttpResponse.json({ items, total })
  }),

  http.get('/api/units/:id', async ({ params }) => {
    await delay(API_DELAY_MS)

    const { id } = params
    const unit = typeof id === 'string' ? db.getById(id) : undefined

    if (!unit) {
      return HttpResponse.json({ message: 'Единица техники не найдена' }, { status: 404 })
    }

    return HttpResponse.json(unit)
  }),

  http.post('/api/units', async ({ request }) => {
    await delay(API_DELAY_MS)

    const draft = (await request.json()) as UnitDraft

    if (db.findByPlateNumber(draft.plateNumber)) {
      return HttpResponse.json({ message: 'Гос. номер уже используется' }, { status: 409 })
    }

    return HttpResponse.json(db.create(draft), { status: 201 })
  }),

  http.patch('/api/units/:id', async ({ request, params }) => {
    await delay(API_DELAY_MS)

    const { id } = params

    if (typeof id !== 'string') {
      return HttpResponse.json({ message: 'Некорректный идентификатор' }, { status: 400 })
    }

    const draft = (await request.json()) as UnitDraft
    const duplicate = db.findByPlateNumber(draft.plateNumber)

    if (duplicate && duplicate.id !== id) {
      return HttpResponse.json({ message: 'Гос. номер уже используется' }, { status: 409 })
    }

    const updated = db.update(id, draft)

    if (!updated) {
      return HttpResponse.json({ message: 'Единица техники не найдена' }, { status: 404 })
    }

    return HttpResponse.json(updated)
  }),
]
