import type { ReactNode } from 'react'
import { Group, Stack, Text, Title } from '@mantine/core'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <Group justify="space-between" align="flex-end" mb="xl" gap="md">
      <Stack gap={4}>
        <Title order={1} fz={{ base: 26, sm: 32 }} fw={800} style={{ letterSpacing: '-0.02em' }}>
          {title}
        </Title>
        {description && <Text c="dimmed">{description}</Text>}
      </Stack>
      {actions}
    </Group>
  )
}
