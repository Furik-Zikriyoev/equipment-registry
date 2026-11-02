import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Anchor,
  Button,
  Group,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Timeline,
  Title,
} from '@mantine/core'
import { IconArrowLeft, IconPencil, IconTool, IconHammer } from '@tabler/icons-react'

import type { Unit, UnitStatus } from '../../types/unit'
import { UNIT_STATUSES } from '../../types/unit'
import { useT } from '../../i18n/useT'
import { ApiError } from '../../api/client'
import { useSaveUnit } from '../../hooks/useSaveUnit'
import { useUnit } from '../../hooks/useUnit'
import { useUnitHistory } from '../../hooks/useUnitHistory'
import { formatDate } from '../../shared/lib/date'
import { formatMileage, formatMoney } from '../../shared/lib/format'
import { getNextServiceDate } from '../../shared/lib/service'
import { usePageTitle } from '../../shared/lib/usePageTitle'
import { EmptyState } from '../../shared/ui/EmptyState'
import { ErrorState } from '../../shared/ui/ErrorState'
import { ServiceDue } from '../../shared/ui/ServiceDue'
import { STATUS_COLORS } from '../../shared/ui/StatusBadge'
import { UnitTypeIcon } from '../../shared/ui/UnitTypeIcon'

const NUMERIC_STYLE = { fontVariantNumeric: 'tabular-nums' } as const


function InfoTile({ label, value, extra }: { label: string; value: string; extra?: React.ReactNode }) {
  return (
    <Paper withBorder radius="lg" p="md">
      <Text size="xs" c="dimmed" fw={700} tt="uppercase" style={{ letterSpacing: '0.04em' }}>
        {label}
      </Text>
      <Text fz={22} fw={800} mt={6} style={NUMERIC_STYLE}>
        {value}
      </Text>
      {extra && <Stack mt={8} align="flex-start">{extra}</Stack>}
    </Paper>
  )
}

function History({ unitId }: { unitId: string }) {
  const t = useT()
  const { data, isPending, isError, refetch } = useUnitHistory(unitId)

  if (isPending) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} height={48} />
        ))}
      </Stack>
    )
  }

  if (isError) {
    return <ErrorState message={t.details.historyError} onRetry={() => void refetch()} />
  }

  const spent = data.reduce((sum, record) => sum + record.cost, 0)

  return (
    <Stack gap="lg">
      <Text size="sm" c="dimmed">
        {t.details.spent(t.units.records(data.length), formatMoney(spent))}
      </Text>
      <Timeline bulletSize={30} lineWidth={2} active={-1}>
        {data.map((record) => {
          const isRepair = record.kind === 'repair'

          return (
            <Timeline.Item
              key={record.id}
              bullet={
                <ThemeIcon size={30} radius="xl" variant="light" color={isRepair ? 'orange' : 'brand'}>
                  {isRepair ? <IconHammer size={16} /> : <IconTool size={16} />}
                </ThemeIcon>
              }
              title={
                <Group justify="space-between" gap="xs" wrap="nowrap" align="flex-start">
                  <Text fw={600} size="sm">
                    {record.title}
                  </Text>
                  <Text fw={700} size="sm" style={{ ...NUMERIC_STYLE, whiteSpace: 'nowrap' }}>
                    {formatMoney(record.cost)}
                  </Text>
                </Group>
              }
            >
              <Text size="xs" c="dimmed" mt={2} style={NUMERIC_STYLE}>
                {t.serviceKind[record.kind]} · {formatDate(record.date)} ·{' '}
                {formatMileage(record.mileage)}
              </Text>
            </Timeline.Item>
          )
        })}
      </Timeline>
    </Stack>
  )
}

function UnitDetails({ unit }: { unit: Unit }) {
  const t = useT()
  const saveUnit = useSaveUnit(unit.id)
  const statusOptions = UNIT_STATUSES.map((value) => ({ value, label: t.unitStatus[value] }))

  function changeStatus(status: UnitStatus) {
    saveUnit.mutate({
      plateNumber: unit.plateNumber,
      model: unit.model,
      type: unit.type,
      status,
      mileage: unit.mileage,
      lastServiceDate: unit.lastServiceDate,
    })
  }

  const nextService = getNextServiceDate(unit.lastServiceDate)

  return (
    <Stack gap="md">
      <Paper withBorder radius="lg" p={{ base: 'md', sm: 'xl' }}>
        <Group justify="space-between" align="flex-start" gap="lg">
          <Group gap="md" wrap="nowrap">
            <UnitTypeIcon type={unit.type} size={64} />
            <Stack gap={2}>
              <Title order={1} ff="monospace" fz={{ base: 24, sm: 30 }} fw={700}>
                {unit.plateNumber}
              </Title>
              <Text c="dimmed">
                {unit.model} · {t.unitType[unit.type]}
              </Text>
            </Stack>
          </Group>

          <Button
            component={Link}
            to={`/units/${unit.id}/edit`}
            variant="default"
            leftSection={<IconPencil size={16} />}
          >
            {t.details.edit}
          </Button>
        </Group>

        <Stack gap={6} mt="xl">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase" style={{ letterSpacing: '0.04em' }}>
            {t.details.status}
          </Text>
          <SegmentedControl
            data={statusOptions}
            value={unit.status}
            onChange={(value) => {
              const status = UNIT_STATUSES.find((item) => item === value)
              if (status) changeStatus(status)
            }}
            color={STATUS_COLORS[unit.status]}
            disabled={saveUnit.isPending}
            fullWidth
            maw={480}
          />
          {saveUnit.isError && (
            <Text size="sm" c="red">
              {t.details.statusError(saveUnit.error.message)}
            </Text>
          )}
        </Stack>
      </Paper>

      <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="md">
        <InfoTile label={t.details.mileage} value={formatMileage(unit.mileage)} />
        <InfoTile label={t.details.lastService} value={formatDate(unit.lastServiceDate)} />
        <InfoTile
          label={t.details.nextService}
          value={formatDate(nextService)}
          extra={<ServiceDue lastServiceDate={unit.lastServiceDate} />}
        />
      </SimpleGrid>

      <Paper withBorder radius="lg" p={{ base: 'md', sm: 'xl' }}>
        <Title order={2} fz="lg" fw={700} mb="xs">
          {t.details.history}
        </Title>
        <History unitId={unit.id} />
      </Paper>
    </Stack>
  )
}

export function UnitDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isPending, isError, error, refetch } = useUnit(id)
  const t = useT()
  usePageTitle(data ? `${data.plateNumber} · ${data.model}` : t.details.pageTitle)

  function renderContent() {
    if (isPending) {
      return (
        <Stack gap="md">
          <Skeleton height={200} radius="lg" />
          <SimpleGrid cols={{ base: 1, xs: 3 }}>
            <Skeleton height={100} radius="lg" />
            <Skeleton height={100} radius="lg" />
            <Skeleton height={100} radius="lg" />
          </SimpleGrid>
        </Stack>
      )
    }

    if (isError) {
      if (error instanceof ApiError && error.status === 404) {
        return (
          <EmptyState
            title={t.details.notFoundTitle}
            description={t.details.notFoundText}
            actionLabel={t.details.toList}
            onAction={() => navigate('/units')}
          />
        )
      }

      return <ErrorState message={error.message} onRetry={() => void refetch()} />
    }

    return <UnitDetails unit={data} />
  }

  return (
    <>
      <Anchor component={Link} to="/units" c="dimmed" size="sm" fw={600} mb="md" display="inline-block">
        <Group gap={6}>
          <IconArrowLeft size={16} />
          {t.details.back}
        </Group>
      </Anchor>
      {renderContent()}
    </>
  )
}
