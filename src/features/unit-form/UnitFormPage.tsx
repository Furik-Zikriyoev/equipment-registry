import { useNavigate, useParams } from 'react-router-dom'
import { Button, Group, Skeleton, Stack, Title } from '@mantine/core'

import { useUnit } from '../../hooks/useUnit'
import { ErrorState } from '../../shared/ui/ErrorState'
import { UnitForm } from './UnitForm'
import type { UnitFormValues } from './unitSchema'

import { ApiError } from '../../api/client'
import { EmptyState } from '../../shared/ui/EmptyState'

const EMPTY_VALUES: UnitFormValues = {
  plateNumber: '',
  model: '',
  type: 'dump_truck',
  status: 'working',
  mileage: '',
  lastServiceDate: '',
}

export function UnitFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isPending, isError, error, refetch } = useUnit(id)

  const isEditMode = Boolean(id)

  function renderForm() {
    if (isEditMode && isPending) {
      return (
        <Stack gap="md" maw={560}>
          <Skeleton height={60} />
          <Skeleton height={60} />
          <Skeleton height={60} />
          <Skeleton height={60} />
        </Stack>
      )
    }

    if (isEditMode && isError) {
      const isNotFound = error instanceof ApiError && error.status === 404

      if (isNotFound) {
        return (
          <EmptyState
            title="Единица техники не найдена"
            description="Запись была удалена, либо ссылка указана неверно."
            actionLabel="К списку техники"
            onAction={() => navigate('/units')}
          />
        )
      }

      return (
        <ErrorState
          message={error.message}
          onRetry={() => {
            void refetch()
          }}
          secondaryLabel="К списку"
          onSecondary={() => navigate('/units')}
        />
      )
    }

    const defaultValues: UnitFormValues = data
      ? {
          plateNumber: data.plateNumber,
          model: data.model,
          type: data.type,
          status: data.status,
          mileage: String(data.mileage),
          lastServiceDate: data.lastServiceDate,
        }
      : EMPTY_VALUES

    return <UnitForm key={id ?? 'new'} unitId={id} defaultValues={defaultValues} />
  }

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={2}>{isEditMode ? 'Редактирование техники' : 'Новая единица техники'}</Title>
        <Button variant="subtle" onClick={() => navigate('/units')}>
          К списку
        </Button>
      </Group>

      {renderForm()}
    </>
  )
}
