import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Group, Modal, Paper, Select, Stack, Text, TextInput } from '@mantine/core'

import type { UnitDraft } from '../../types/unit'
import { UNIT_STATUSES, UNIT_TYPES } from '../../types/unit'
import { useT } from '../../i18n/useT'
import type { Messages } from '../../i18n/messages'
import { checkPlateNumber } from '../../api/units'
import { useSaveUnit } from '../../hooks/useSaveUnit'
import { useUnsavedChangesGuard } from '../../hooks/useUnsavedChangesGuard'
import { parseEnumValue } from '../../shared/lib/parse'
import type { UnitFormValues } from './unitSchema'
import { unitSchema } from './unitSchema'

type ErrorKey = keyof Messages['form']['errors']

/** Сообщения схемы — ключи; здесь превращаем их в текст на текущем языке. */
function errorText(t: Messages, message: string | undefined): string | undefined {
  if (!message) return undefined
  return message in t.form.errors ? t.form.errors[message as ErrorKey] : message
}

type PlateStatus = 'idle' | 'checking' | 'taken'

interface UnitFormProps {
  unitId?: string
  defaultValues: UnitFormValues
}

export function UnitForm({ unitId, defaultValues }: UnitFormProps) {
  const navigate = useNavigate()
  const t = useT()
  const saveUnit = useSaveUnit(unitId)
  const TYPE_OPTIONS = UNIT_TYPES.map((type) => ({ value: type, label: t.unitType[type] }))
  const STATUS_OPTIONS = UNIT_STATUSES.map((status) => ({ value: status, label: t.unitStatus[status] }))

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

    const saved = await saveUnit.mutateAsync(draft)
    guard.allowNavigation()
    navigate(`/units/${saved.id}`)
  })

  const plateField = register('plateNumber')
  const isSaveDisabled = !isValid || plateStatus !== 'idle' || isSubmitting

  return (
    <>
      <Paper withBorder radius="lg" p={{ base: 'md', sm: 'xl' }} maw={640}>
        <form
          noValidate
          onSubmit={(event) => {
            void submit(event)
          }}
        >
          <Stack gap="md">
            {saveUnit.isError && (
              <Alert color="red" title={t.form.saveError}>
                {saveUnit.error.message}
              </Alert>
            )}

            <TextInput
              label={t.form.plate}
              placeholder="01 A 123 AA"
              withAsterisk
              description={plateStatus === 'checking' ? t.form.checkingPlate : undefined}
              error={
                errorText(t, errors.plateNumber?.message) ??
                (plateStatus === 'taken' ? t.form.plateTaken : undefined)
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
              label={t.form.model}
              placeholder={t.form.modelPlaceholder}
              withAsterisk
              error={errorText(t, errors.model?.message)}
              {...register('model')}
            />

            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select
                  label={t.form.type}
                  withAsterisk
                  allowDeselect={false}
                  data={TYPE_OPTIONS}
                  value={field.value}
                  onChange={(value) =>
                    field.onChange(parseEnumValue(value, UNIT_TYPES) ?? field.value)
                  }
                  onBlur={field.onBlur}
                  error={errorText(t, errors.type?.message)}
                />
              )}
            />

            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  label={t.form.status}
                  withAsterisk
                  allowDeselect={false}
                  data={STATUS_OPTIONS}
                  value={field.value}
                  onChange={(value) =>
                    field.onChange(parseEnumValue(value, UNIT_STATUSES) ?? field.value)
                  }
                  onBlur={field.onBlur}
                  error={errorText(t, errors.status?.message)}
                />
              )}
            />

            <TextInput
              label={t.form.mileage}
              placeholder="124500"
              inputMode="numeric"
              withAsterisk
              error={errorText(t, errors.mileage?.message)}
              {...register('mileage')}
            />

            <TextInput
              label={t.form.lastService}
              type="date"
              withAsterisk
              error={errorText(t, errors.lastServiceDate?.message)}
              {...register('lastServiceDate')}
            />

            <Group justify="flex-end" mt="sm">
              <Button variant="default" onClick={() => navigate(unitId ? `/units/${unitId}` : '/units')}>
                {t.form.cancel}
              </Button>
              <Button type="submit" loading={isSubmitting} disabled={isSaveDisabled}>
                {t.form.save}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      <Modal
        opened={guard.isBlocked}
        onClose={guard.cancelLeave}
        title={t.form.unsavedTitle}
        centered
      >
        <Text size="sm">
          {t.form.unsavedText}
        </Text>

        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={guard.cancelLeave}>
            {t.form.stay}
          </Button>
          <Button color="red" onClick={guard.confirmLeave}>
            {t.form.leave}
          </Button>
        </Group>
      </Modal>
    </>
  )
}
