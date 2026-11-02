import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  Grid,
  Group,
  Paper,
  Progress,
  RingProgress,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core'
import {
  IconAlertTriangle,
  IconArrowRight,
  IconCircleCheck,
  IconTool,
  IconTruck,
} from '@tabler/icons-react'

import type { FleetStats } from '../../types/unit'
import { UNIT_STATUSES, UNIT_TYPES } from '../../types/unit'
import { useT } from '../../i18n/useT'
import { useStats } from '../../hooks/useStats'
import { usePageTitle } from '../../shared/lib/usePageTitle'
import { formatDate } from '../../shared/lib/date'
import { formatMileage } from '../../shared/lib/format'
import { getNextServiceDate } from '../../shared/lib/service'
import { ErrorState } from '../../shared/ui/ErrorState'
import { PageHeader } from '../../shared/ui/PageHeader'
import { ServiceDue } from '../../shared/ui/ServiceDue'
import { STATUS_COLORS } from '../../shared/ui/StatusBadge'
import { StatTile } from '../../shared/ui/StatTile'
import { UnitTypeIcon } from '../../shared/ui/UnitTypeIcon'

const NUMERIC_STYLE = { fontVariantNumeric: 'tabular-nums' } as const

function percent(part: number, total: number): number {
  return total === 0 ? 0 : Math.round((part / total) * 100)
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Title order={3} fz="lg" fw={700} mb="md">
      {children}
    </Title>
  )
}

function Readiness({ stats }: { stats: FleetStats }) {
  const t = useT()
  const ready = percent(stats.byStatus.working, stats.total)

  return (
    <Paper withBorder radius="lg" p="lg" h="100%">
      <SectionTitle>{t.dashboard.readiness}</SectionTitle>
      <Group gap="xl" wrap="nowrap" align="center">
        <RingProgress
          size={160}
          thickness={16}
          roundCaps
          sections={UNIT_STATUSES.map((status) => ({
            value: percent(stats.byStatus[status], stats.total),
            color: `${STATUS_COLORS[status]}.6`,
            tooltip: `${t.unitStatus[status]}: ${stats.byStatus[status]}`,
          }))}
          label={
            <Stack gap={0} align="center">
              <Text fz={28} fw={800} lh={1}>
                {ready}%
              </Text>
              <Text size="xs" c="dimmed">
                {t.dashboard.inWork}
              </Text>
            </Stack>
          }
        />
        <Stack gap="sm" style={{ flex: 1 }}>
          {UNIT_STATUSES.map((status) => (
            <Group key={status} justify="space-between" wrap="nowrap">
              <Group gap={8} wrap="nowrap">
                <Box w={10} h={10} bg={`${STATUS_COLORS[status]}.6`} style={{ borderRadius: 3 }} />
                <Text size="sm">{t.unitStatus[status]}</Text>
              </Group>
              <Text size="sm" fw={700} style={NUMERIC_STYLE}>
                {stats.byStatus[status]}
              </Text>
            </Group>
          ))}
        </Stack>
      </Group>
    </Paper>
  )
}

function ByType({ stats }: { stats: FleetStats }) {
  const t = useT()
  return (
    <Paper withBorder radius="lg" p="lg" h="100%">
      <SectionTitle>{t.dashboard.byType}</SectionTitle>
      <Stack gap="lg">
        {UNIT_TYPES.map((type) => {
          const counts = stats.byType[type]
          const total = UNIT_STATUSES.reduce((sum, status) => sum + counts[status], 0)

          return (
            <Stack key={type} gap={8}>
              <Group justify="space-between" wrap="nowrap">
                <Group gap="sm" wrap="nowrap">
                  <UnitTypeIcon type={type} size={30} />
                  <Text fw={600}>{t.unitType[type]}</Text>
                </Group>
                <Text size="sm" c="dimmed" style={NUMERIC_STYLE}>
                  {t.units.cars(total)}
                </Text>
              </Group>
              <Progress.Root size={12} radius="xl">
                {UNIT_STATUSES.map((status) => (
                  <Progress.Section
                    key={status}
                    value={percent(counts[status], total)}
                    color={`${STATUS_COLORS[status]}.6`}
                    title={`${t.unitStatus[status]}: ${counts[status]}`}
                  />
                ))}
              </Progress.Root>
            </Stack>
          )
        })}
      </Stack>
    </Paper>
  )
}

function Attention({ stats }: { stats: FleetStats }) {
  const t = useT()
  return (
    <Paper withBorder radius="lg" p="lg">
      <Group justify="space-between" mb="md">
        <Title order={3} fz="lg" fw={700}>
          {t.dashboard.upcoming}
        </Title>
        <Button
          component={Link}
          to="/units?sort=lastServiceDate&order=asc"
          variant="subtle"
          color="gray"
          size="compact-sm"
          rightSection={<IconArrowRight size={14} />}
        >
          {t.dashboard.byServiceDate}
        </Button>
      </Group>

      {stats.attention.length === 0 ? (
        <Text c="dimmed" size="sm">
          {t.dashboard.allServiced}
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm">
          {stats.attention.map((unit) => (
            <UnstyledButton
              key={unit.id}
              component={Link}
              to={`/units/${unit.id}`}
              p="sm"
              style={{
                border: '1px solid var(--mantine-color-default-border)',
                borderRadius: 'var(--mantine-radius-md)',
              }}
            >
              <Group justify="space-between" wrap="nowrap" gap="sm">
                <Group gap="sm" wrap="nowrap">
                  <UnitTypeIcon type={unit.type} />
                  <Stack gap={0}>
                    <Text ff="monospace" fw={600} size="sm">
                      {unit.plateNumber}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {unit.model} · {t.dashboard.dueBy(formatDate(getNextServiceDate(unit.lastServiceDate)))}
                    </Text>
                  </Stack>
                </Group>
                <ServiceDue lastServiceDate={unit.lastServiceDate} />
              </Group>
            </UnstyledButton>
          ))}
        </SimpleGrid>
      )}
    </Paper>
  )
}

function DashboardSkeleton() {
  return (
    <Stack gap="md">
      <SimpleGrid cols={{ base: 2, md: 4 }}>
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} height={120} radius="lg" />
        ))}
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Skeleton height={240} radius="lg" />
        <Skeleton height={240} radius="lg" />
      </SimpleGrid>
    </Stack>
  )
}

export function DashboardPage() {
  const { data: stats, isPending, isError, error, refetch } = useStats()
  const t = useT()
  usePageTitle(t.dashboard.title)

  return (
    <>
      <PageHeader
        title={t.dashboard.title}
        description={t.dashboard.subtitle}
        actions={
          <Button
            component={Link}
            to="/units"
            variant="default"
            rightSection={<IconArrowRight size={16} />}
          >
            {t.dashboard.allUnits}
          </Button>
        }
      />

      {isPending && <DashboardSkeleton />}

      {isError && (
        <Paper withBorder radius="lg" p="md">
          <ErrorState message={error.message} onRetry={() => void refetch()} />
        </Paper>
      )}

      {stats && (
        <Stack gap="md">
          <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
            <StatTile
              label={t.dashboard.total}
              value={stats.total}
              hint={t.dashboard.totalHint(formatMileage(stats.totalMileage))}
              icon={<IconTruck size={18} />}
              color="brand"
            />
            <StatTile
              label={t.dashboard.working}
              value={stats.byStatus.working}
              hint={t.dashboard.workingHint(percent(stats.byStatus.working, stats.total))}
              icon={<IconCircleCheck size={18} />}
              color="teal"
            />
            <StatTile
              label={t.dashboard.repair}
              value={stats.byStatus.repair}
              hint={t.dashboard.repairHint(stats.byStatus.idle)}
              icon={<IconTool size={18} />}
              color="orange"
            />
            <StatTile
              label={t.dashboard.needService}
              value={stats.serviceOverdue + stats.serviceSoon}
              hint={t.dashboard.needServiceHint(stats.serviceOverdue)}
              icon={<IconAlertTriangle size={18} />}
              color="red"
            />
          </SimpleGrid>

          <Grid gap="md">
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Readiness stats={stats} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <ByType stats={stats} />
            </Grid.Col>
          </Grid>

          <Attention stats={stats} />
        </Stack>
      )}
    </>
  )
}
