import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Group, Modal, Paper, Select, Stack, Text, TextInput } from '@mantine/core'

import type { UnitDraft } from '../../types/unit'
import { UNIT_STATUSES, UNIT_STATUS_LABELS, UNIT_TYPES, UNIT_TYPE_LABELS } from '../../types/unit'
import { checkPlateNumber } from '../../api/units'
import { useSaveUnit } from '../../hooks/useSaveUnit'
import { useUnsavedChangesGuard } from '../../hooks/useUnsavedChangesGuard'
import { parseEnumValue } from '../../shared/lib/parse'
import type { UnitFormValues } from './unitSchema'
import { unitSchema } from './unitSchema'

const TYPE_OPTIONS = UNIT_TYPES.map((type) => ({ value: type, label: UNIT_TYPE_LABELS[type] }))

const STATUS_OPTIONS = UNIT_STATUSES.map((status) => ({
  value: status,
  label: UNIT_STATUS_LABELS[status],
}))

type PlateStatus = 'idle' | 'checking' | 'taken'

interface UnitFormProps {
  unitId?: string
  defaultValues: UnitFormValues
}

export function UnitForm({ unitId, defaultValues }: UnitFormProps) {
  const navigate = useNavigate()
  const saveUnit = useSaveUnit(unitId)

  const [plateStatus, setPlateStatus] = useState<PlateStatus>('idle')
  const plateRequestIdRef = useRef(0)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues,
    mode: 'onBlur',
  })

  const guard = useUnsavedChangesGuard(isDirty)

  async function verifyPlateNumber(rawValue: string): Promise<void> {
    const plateNumber = rawValue.trim()

    if (!plateNumber) {
      setPlateStatus('idle')

      return
    }

    plateRequestIdRef.current += 1
    const requestId = plateRequestIdRef.current
    setPlateStatus('checking')

    try {
      const { available } = await checkPlateNumber(plateNumber, unitId)

      if (requestId !== plateRequestIdRef.current) {
        return
      }

      setPlateStatus(available ? 'idle' : 'taken')
    } catch {
      if (requestId === plateRequestIdRef.current) {
        setPlateStatus('idle')
      }
    }
  }

  const submit = handleSubmit(async (values) => {
    const draft: UnitDraft = {
      plateNumber: values.plateNumber.trim(),
      model: values.model.trim(),
      type: values.type,
      status: values.status,
      mileage: Number(values.mileage),
      lastServiceDate: values.lastServiceDate,
    }

    await saveUnit.mutateAsync(draft)
    guard.allowNavigation()
    navigate('/units')
  })

  const plateField = register('plateNumber')
  const isSaveDisabled = !isValid || plateStatus !== 'idle' || isSubmitting

  return (
    <>
      <Paper withBorder p="lg" maw={560}>
        <form
          noValidate
          onSubmit={(event) => {
            void submit(event)
          }}
        >
          <Stack gap="md">
            {saveUnit.isError && (
              <Alert color="red" title="Не удалось сохранить">
                {saveUnit.error.message}
              </Alert>
            )}

            <TextInput
              label="Гос. номер"
              placeholder="01 A 123 AA"
              withAsterisk
              description={plateStatus === 'checking' ? 'Проверяем номер…' : undefined}
              error={
                errors.plateNumber?.message ??
                (plateStatus === 'taken' ? 'Такой гос. номер уже используется' : undefined)
              }
              {...plateField}
              onChange={(event) => {
                setPlateStatus('idle')
                void plateField.onChange(event)
              }}
              onBlur={(event) => {
                void plateField.onBlur(event)
                void verifyPlateNumber(event.currentTarget.value)
              }}
            />

            <TextInput
              label="Модель"
              placeholder="КамАЗ 6520"
              withAsterisk
              error={errors.model?.message}
              {...register('model')}
            />

            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select
                  label="Тип"
                  withAsterisk
                  allowDeselect={false}
                  data={TYPE_OPTIONS}
                  value={field.value}
                  onChange={(value) =>
                    field.onChange(parseEnumValue(value, UNIT_TYPES) ?? field.value)
                  }
                  onBlur={field.onBlur}
                  error={errors.type?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  label="Статус"
                  withAsterisk
                  allowDeselect={false}
                  data={STATUS_OPTIONS}
                  value={field.value}
                  onChange={(value) =>
                    field.onChange(parseEnumValue(value, UNIT_STATUSES) ?? field.value)
                  }
                  onBlur={field.onBlur}
                  error={errors.status?.message}
                />
              )}
            />

            <TextInput
              label="Пробег, км"
              placeholder="124500"
              inputMode="numeric"
              withAsterisk
              error={errors.mileage?.message}
              {...register('mileage')}
            />

            <TextInput
              label="Дата последнего ТО"
              type="date"
              withAsterisk
              error={errors.lastServiceDate?.message}
              {...register('lastServiceDate')}
            />

            <Group justify="flex-end" mt="sm">
              <Button variant="default" onClick={() => navigate('/units')}>
                Отмена
              </Button>
              <Button type="submit" loading={isSubmitting} disabled={isSaveDisabled}>
                Сохранить
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      <Modal
        opened={guard.isBlocked}
        onClose={guard.cancelLeave}
        title="Несохранённые изменения"
        centered
      >
        <Text size="sm">
          В форме есть изменения, которые не были сохранены. Если уйти сейчас, они будут потеряны.
        </Text>

        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={guard.cancelLeave}>
            Остаться
          </Button>
          <Button color="red" onClick={guard.confirmLeave}>
            Уйти без сохранения
          </Button>
        </Group>
      </Modal>
    </>
  )
}
