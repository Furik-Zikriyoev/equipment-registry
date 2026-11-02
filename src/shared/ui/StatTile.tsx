import type { ReactNode } from 'react'
import { Group, Paper, Stack, Text, ThemeIcon } from '@mantine/core'

interface StatTileProps {
  label: string
  value: ReactNode
  hint?: ReactNode
  icon: ReactNode
  color: string
}

export function StatTile({ label, value, hint, icon, color }: StatTileProps) {
  return (
    <Paper withBorder p="md" radius="lg">
      <Stack gap={6}>
        <Group justify="space-between" wrap="nowrap" align="flex-start">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase" style={{ letterSpacing: '0.04em' }}>
            {label}
          </Text>
          <ThemeIcon variant="light" color={color} size={32} radius="md">
            {icon}
          </ThemeIcon>
        </Group>
        <Text fz={30} fw={800} lh={1} style={{ fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </Text>
        {hint && (
          <Text size="sm" c="dimmed">
            {hint}
          </Text>
        )}
      </Stack>
    </Paper>
  )
}
