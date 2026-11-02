import { useNavigate, useParams } from 'react-router-dom'
import { Button, Skeleton, Stack } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'

import { PageHeader } from '../../shared/ui/PageHeader'
import { usePageTitle } from '../../shared/lib/usePageTitle'

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
  usePageTitle(isEditMode ? (data ? `Редактирование ${data.plateNumber}` : 'Редактирование') : 'Новая техника')

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
      <PageHeader
        title={isEditMode ? 'Редактирование' : 'Новая техника'}
        description={
          isEditMode && data
            ? `${data.plateNumber} · ${data.model}`
            : 'Заполните данные машины. Гос. номер проверяется на уникальность'
        }
        actions={
          <Button
            variant="default"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate(isEditMode && id ? `/units/${id}` : '/units')}
          >
            {isEditMode ? 'К карточке' : 'К списку'}
          </Button>
        }
      />

      {renderForm()}
    </>
  )
}
