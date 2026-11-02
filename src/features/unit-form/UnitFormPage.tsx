import { useNavigate, useParams } from 'react-router-dom'
import { Button, Skeleton, Stack } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'

import { PageHeader } from '../../shared/ui/PageHeader'
import { usePageTitle } from '../../shared/lib/usePageTitle'
import { useT } from '../../i18n/useT'

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

  const t = useT()
  const isEditMode = Boolean(id)
  usePageTitle(isEditMode ? (data ? t.form.editPageTitle(data.plateNumber) : t.form.editTitle) : t.form.newTitle)

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
            title={t.details.notFoundTitle}
            description={t.details.notFoundText}
            actionLabel={t.details.toList}
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
          secondaryLabel={t.form.toList}
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
        title={isEditMode ? t.form.editTitle : t.form.newTitle}
        description={
          isEditMode && data
            ? `${data.plateNumber} · ${data.model}`
            : t.form.newHint
        }
        actions={
          <Button
            variant="default"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate(isEditMode && id ? `/units/${id}` : '/units')}
          >
            {isEditMode ? t.form.toCard : t.form.toList}
          </Button>
        }
      />

      {renderForm()}
    </>
  )
}
