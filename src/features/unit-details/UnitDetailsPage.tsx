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
import { SERVICE_KIND_LABELS, UNIT_STATUSES, UNIT_STATUS_LABELS, UNIT_TYPE_LABELS } from '../../types/unit'
import { ApiError } from '../../api/client'
import { useSaveUnit } from '../../hooks/useSaveUnit'
import { useUnit } from '../../hooks/useUnit'
import { useUnitHistory } from '../../hooks/useUnitHistory'
import { formatDate } from '../../shared/lib/date'
import { formatMileage, formatMoney, pluralize } from '../../shared/lib/format'
import { getNextServiceDate } from '../../shared/lib/service'
import { EmptyState } from '../../shared/ui/EmptyState'
import { ErrorState } from '../../shared/ui/ErrorState'
import { ServiceDue } from '../../shared/ui/ServiceDue'
import { STATUS_COLORS } from '../../shared/ui/StatusBadge'
import { UnitTypeIcon } from '../../shared/ui/UnitTypeIcon'

const NUMERIC_STYLE = { fontVariantNumeric: 'tabular-nums' } as const

const STATUS_OPTIONS = UNIT_STATUSES.map((status) => ({
  value: status,
  label: UNIT_STATUS_LABELS[status],
}))

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
    return <ErrorState message="История обслуживания не загрузилась" onRetry={() => void refetch()} />
  }

  const spent = data.reduce((sum, record) => sum + record.cost, 0)

  return (
    <Stack gap="lg">
      <Text size="sm" c="dimmed">
        {data.length} {pluralize(data.length, ['запись', 'записи', 'записей'])} · затраты за период{' '}
        {formatMoney(spent)}
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
                {SERVICE_KIND_LABELS[record.kind]} · {formatDate(record.date)} ·{' '}
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
  const saveUnit = useSaveUnit(unit.id)

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
                {unit.model} · {UNIT_TYPE_LABELS[unit.type]}
              </Text>
            </Stack>
          </Group>

          <Button
            component={Link}
            to={`/units/${unit.id}/edit`}
            variant="default"
            leftSection={<IconPencil size={16} />}
          >
            Редактировать
          </Button>
        </Group>

        <Stack gap={6} mt="xl">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase" style={{ letterSpacing: '0.04em' }}>
            Статус
          </Text>
          <SegmentedControl
            data={STATUS_OPTIONS}
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
              Не удалось сменить статус: {saveUnit.error.message}
            </Text>
          )}
        </Stack>
      </Paper>

      <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="md">
        <InfoTile label="Пробег" value={formatMileage(unit.mileage)} />
        <InfoTile label="Последнее ТО" value={formatDate(unit.lastServiceDate)} />
        <InfoTile
          label="Следующее ТО"
          value={formatDate(nextService)}
          extra={<ServiceDue lastServiceDate={unit.lastServiceDate} />}
        />
      </SimpleGrid>

      <Paper withBorder radius="lg" p={{ base: 'md', sm: 'xl' }}>
        <Title order={2} fz="lg" fw={700} mb="xs">
          История обслуживания
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
            title="Единица техники не найдена"
            description="Запись была удалена, либо ссылка указана неверно."
            actionLabel="К списку техники"
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
          Вся техника
        </Group>
      </Anchor>
      {renderContent()}
    </>
  )
}
